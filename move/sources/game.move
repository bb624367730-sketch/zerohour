#[allow(implicit_const_copy, lint(self_transfer))]
module fomo3d_sui::game {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::random::{Self, Random};
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::object::{Self, UID};

    // ─── Errors ───────────────────────────────────────────
    const E_INVALID_TEAM: u64 = 0;
    const E_INVALID_TICKETS: u64 = 1;
    const E_INSUFFICIENT_PAYMENT: u64 = 2;
    const E_ROUND_NOT_EXPIRED: u64 = 3;
    const E_UNAUTHORIZED: u64 = 4;
    const E_ROUND_ENDED: u64 = 6;
    const E_NO_DIVIDENDS: u64 = 8;
    const E_GAME_PAUSED: u64 = 9;

    // ─── Time Constants ───────────────────────────────────
    const TIMER_MAX_MS: u64 = 24 * 60 * 60 * 1000;  // 24 hours
    const TIMER_EXTENSION_MS_PER_TICKET: u64 = 30 * 1000; // 30 seconds
    const ONE_SUI: u64 = 1_000_000_000;              // 1 SUI in MIST

    // ─── Pricing Constants ────────────────────────────────
    const TICKET_PRICE_BASE: u64 = 10_000_000;          // 0.01 SUI
    const TICKET_PRICE_INCREMENT: u64 = 100_000;        // 0.0001 SUI per ticket
    const MAX_TICKETS_PER_TX: u64 = 500;

    // ─── Dividend Precision ───────────────────────────────
    const PRECISION: u64 = 1_000_000_000;

    // ─── Team Constants ───────────────────────────────────
    const TEAM_DOGE: u8 = 0;
    const TEAM_PEPE: u8 = 1;
    const TEAM_MONKEY: u8 = 2;
    const TEAM_CAT: u8 = 3;

    // Team allocation table: (player_div_bps, jackpot_bps, zh_bps) out of 10000
    // fixed: referral=1000(10%), community=200(2%), airdrop=100(1%) = 1300 bps (13%)
    // variable: player_div + jackpot + zh = 8700 bps (87%)
    //
    // Doge:  player_div=56%, jackpot=20%, zh=10%
    // Pepe:  player_div=43%, jackpot=35%, zh=8%
    // Monkey: player_div=30%, jackpot=50%, zh=6%
    // Cat:   player_div=43%, jackpot=43%, zh=0%

    // Format: player_div_bps, jackpot_bps, zh_bps (each out of 10000)
    // Each row sums to 8700 bps = player_div + jackpot + zh.
    // The remaining 1300 bps are fixed: referral=1000, community=200, airdrop=100.
    const TEAM_DATA: vector<u64> = vector[
        5600, 2100, 1000,  // Doge:  56% player div, 21% jackpot, 10% ZH
        4300, 3600, 800,   // Pepe:  43% player div, 36% jackpot, 8% ZH
        3000, 5100, 600,   // Monkey: 30% player div, 51% jackpot, 6% ZH
        4300, 4400, 0,     // Cat:   43% player div, 44% jackpot, 0% ZH
    ];

    // ─── Airdrop Constants ────────────────────────────────
    const AIRDROP_CHANCE_BASE: u64 = 0;              // 0% baseline (in basis points)
    const AIRDROP_CHANCE_INCREMENT: u64 = 10;         // +0.1% per qualifying purchase
    const AIRDROP_CHANCE_MAX: u64 = 10000;            // 100% cap
    const AIRDROP_QUALIFY_MIN: u64 = 100_000_000;     // 0.1 SUI minimum for airdrop chance

    // ─── Structs ──────────────────────────────────────────

    /// Capability that proves the holder is the package publisher.
    /// Required to call create_game.
    public struct AdminCap has key {
        id: UID,
    }

    public struct Game has key {
        id: UID,
        round: u64,
        round_start_ts: u64,
        timer_end_ts: u64,
        last_buyer: address,
        last_buyer_team: u8,

        total_tickets_sold: u64,
        total_sui_volume: u64,

        // Balances
        jackpot: Balance<SUI>,
        player_dividend_pool: Balance<SUI>,
        community_fund: Balance<SUI>,
        airdrop_pool: Balance<SUI>,

        // Dividend accounting (accumulator model, O(1) claims)
        dividend_per_ticket: u64,

        // Airdrop state
        airdrop_chance_bps: u64,
        airdrop_total_wins: u64,
        airdrop_total_paid: u64,

        // Team stats
        team_tickets: vector<u64>,      // 4 entries
        team_players: vector<u64>,   // 4 entries
        team_volume: vector<u64>,    // 4 entries

        // ZH internal accounting (not a transferable token)
        zh_pool: Balance<SUI>,
        zh_per_token: u64,
        zh_total_supply: u64,

        // Admin
        admin: address,
        paused: bool,
    }

    public struct Player has key {
        id: UID,
        owner: address,
        tickets_owned: u64,
        team_id: u8,
        last_dividend_per_ticket: u64,
        round: u64,
        /// Bitmask of teams (bits 0-3) this player has been counted for in team_players
        counted_teams: u8,
        // ZH token holdings & dividend checkpoint
        zh_balance: u64,
        zh_last_per_token: u64,
    }

    // ─── Events ───────────────────────────────────────────

    public struct TicketPurchased has copy, drop {
        round: u64,
        buyer: address,
        team: u8,
        tickets: u64,
        amount: u64,
        new_timer_end_ts: u64,
        total_tickets: u64,
    }

    public struct DividendsClaimed has copy, drop {
        round: u64,
        player: address,
        amount: u64,
    }

    public struct AirdropWon has copy, drop {
        round: u64,
        player: address,
        amount: u64,
        purchase_amount: u64,
    }

    public struct RoundEnded has copy, drop {
        round: u64,
        winner: address,
        winner_team: u8,
        jackpot_amount: u64,
        total_tickets_sold: u64,
        total_volume: u64,
    }

    public struct GameCreated has copy, drop {
        admin: address,
    }

    public struct ZHClaimed has copy, drop {
        player: address,
        amount: u64,
    }

    // ─── Helper Functions ─────────────────────────────────

    /// Get team player dividend percentage in basis points (0-10000)
    fun get_player_div_bps(team: u8): u64 {
        assert!(team <= TEAM_CAT, E_INVALID_TEAM);
        let data = &TEAM_DATA;
        *vector::borrow(data, (team as u64 * 3))
    }

    /// Get team ZH share in basis points (0-10000)
    fun get_zh_bps(team: u8): u64 {
        assert!(team <= TEAM_CAT, E_INVALID_TEAM);
        let data = &TEAM_DATA;
        *vector::borrow(data, (team as u64 * 3 + 2))
    }

    /// Calculate ticket price based on current total tickets sold (linear bonding curve)
    fun get_ticket_price(total_tickets_sold: u64): u64 {
        TICKET_PRICE_BASE + (total_tickets_sold * TICKET_PRICE_INCREMENT)
    }

    /// Check if round has expired
    fun is_round_expired(game: &Game, now_ms: u64): bool {
        now_ms >= game.timer_end_ts
    }

    // ─── Module Init ──────────────────────────────────────

    /// Called once at publish time. Transfers AdminCap to the publisher.
    fun init(ctx: &mut TxContext) {
        transfer::transfer(AdminCap { id: object::new(ctx) }, tx_context::sender(ctx));
    }

    // ─── Entry Functions ──────────────────────────────────

    /// Create a new game. Requires AdminCap (held by package publisher).
    entry fun create_game(_cap: &AdminCap, ctx: &mut TxContext) {
        create_game_impl(tx_context::sender(ctx), ctx);
    }

    fun create_game_impl(sender: address, ctx: &mut TxContext) {
        let team_tickets = vector[0, 0, 0, 0];
        let team_players = vector[0, 0, 0, 0];
        let team_volume = vector[0, 0, 0, 0];

        let game = Game {
            id: object::new(ctx),
            round: 1,
            round_start_ts: 0, // Will be set on first ticket purchase
            timer_end_ts: 0xFFFFFFFFFFFFFFFF,   // Never expires until first purchase
            last_buyer: @0x0,
            last_buyer_team: TEAM_DOGE,
            total_tickets_sold: 0,
            total_sui_volume: 0,
            jackpot: balance::zero<SUI>(),
            player_dividend_pool: balance::zero<SUI>(),
            community_fund: balance::zero<SUI>(),
            airdrop_pool: balance::zero<SUI>(),
            dividend_per_ticket: 0,
            airdrop_chance_bps: AIRDROP_CHANCE_BASE,
            airdrop_total_wins: 0,
            airdrop_total_paid: 0,
            team_tickets,
            team_players,
            team_volume,
            zh_pool: balance::zero<SUI>(),
            zh_per_token: 0,
            zh_total_supply: 0,
            admin: sender,
            paused: false,
        };

        event::emit(GameCreated { admin: sender });
        transfer::share_object(game);
    }

    /// Buy tickets for the first time. Creates a Player object for the sender.
    /// payment: SUI coin to spend (excess is refunded automatically)
    entry fun buy_tickets_first(
        game: &mut Game,
        payment: Coin<SUI>,
        team: u8,
        tickets: u64,
        referrer: address,
        clock: &Clock,
        rng: &Random,
        ctx: &mut TxContext,
    ) {
        let now_ms = clock::timestamp_ms(clock);
        if (is_round_expired(game, now_ms)) {
            settle_round(game, now_ms, ctx);
        };

        assert!(!game.paused, E_GAME_PAUSED);

        let sender = tx_context::sender(ctx);

        // Create player record for this sender
        let mut player = Player {
            id: object::new(ctx),
            owner: sender,
            tickets_owned: 0,
            team_id: team,
            last_dividend_per_ticket: 0,
            round: game.round,
            counted_teams: 0,
            zh_balance: 0,
            zh_last_per_token: 0,
        };

        // Do the purchase
        buy_tickets_internal(game, &mut player, payment, team, tickets, referrer, clock, rng, ctx);

        // Transfer player object to sender
        transfer::transfer(player, sender);
    }

    /// Buy tickets with an existing Player object.
    entry fun buy_tickets(
        game: &mut Game,
        player: &mut Player,
        payment: Coin<SUI>,
        team: u8,
        tickets: u64,
        referrer: address,
        clock: &Clock,
        rng: &Random,
        ctx: &mut TxContext,
    ) {
        let now_ms = clock::timestamp_ms(clock);
        if (is_round_expired(game, now_ms)) {
            settle_round(game, now_ms, ctx);
        };

        assert!(!game.paused, E_GAME_PAUSED);

        buy_tickets_internal(game, player, payment, team, tickets, referrer, clock, rng, ctx);
    }

    /// Claim accumulated dividends. Works across rounds.
    entry fun claim_dividends(
        game: &mut Game,
        player: &mut Player,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let now_ms = clock::timestamp_ms(clock);
        if (is_round_expired(game, now_ms)) {
            settle_round(game, now_ms, ctx);
        };

        let owed = calculate_dividends(game, player);
        assert!(owed > 0, E_NO_DIVIDENDS);

        // Update player's checkpoint
        player.last_dividend_per_ticket = game.dividend_per_ticket;

        // Withdraw from dividend pool
        let reward = balance::split(&mut game.player_dividend_pool, owed);
        let reward_coin = coin::from_balance(reward, ctx);

        event::emit(DividendsClaimed {
            round: game.round,
            player: player.owner,
            amount: owed,
        });

        transfer::public_transfer(reward_coin, player.owner);
    }

    /// Claim accumulated ZH dividends in SUI. Works across rounds.
    entry fun claim_zh_dividends(
        game: &mut Game,
        player: &mut Player,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let now_ms = clock::timestamp_ms(clock);
        if (is_round_expired(game, now_ms)) {
            settle_round(game, now_ms, ctx);
        };

        let owed = calculate_zh_dividends(game, player);
        assert!(owed > 0, E_NO_DIVIDENDS);

        player.zh_last_per_token = game.zh_per_token;

        let reward = balance::split(&mut game.zh_pool, owed);
        let reward_coin = coin::from_balance(reward, ctx);

        event::emit(ZHClaimed {
            player: player.owner,
            amount: owed,
        });

        transfer::public_transfer(reward_coin, player.owner);
    }

    /// End the current round if the timer has expired. Anyone can call this.
    entry fun end_round_if_expired(
        game: &mut Game,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let now_ms = clock::timestamp_ms(clock);
        assert!(is_round_expired(game, now_ms), E_ROUND_NOT_EXPIRED);
        settle_round(game, now_ms, ctx);
    }

    /// Settle the current round and start a new one. No-op if no tickets sold (extends timer).
    fun settle_round(game: &mut Game, now_ms: u64, ctx: &mut TxContext) {
        // If no tickets were sold, reset timer and keep carry intact
        if (game.total_tickets_sold == 0) {
            game.timer_end_ts = now_ms + TIMER_MAX_MS;
            return
        };

        let winner = game.last_buyer;
        let winner_team = game.last_buyer_team;
        let jackpot_amount = balance::value(&game.jackpot);
        let total_keys = game.total_tickets_sold;
        let total_volume = game.total_sui_volume;

        // Jackpot distribution:
        // 48% → winner, 15-30% → player dividend pool, 10-25% → next round, 2% → community
        let jackpot_value = balance::value(&game.jackpot);

        // Player dividend from jackpot: varies by team.
        // carry + player_div must sum to 5000 so winner gets exactly 48%.
        let (player_div_bps, carry_bps) = if (winner_team == TEAM_DOGE) (4000u64, 1000u64)
            else if (winner_team == TEAM_PEPE) (4000u64, 1000u64)
            else if (winner_team == TEAM_MONKEY) (2500u64, 2500u64)
            else (2500u64, 2500u64); // Cat
        let player_div_amount = ((jackpot_value as u128) * (player_div_bps as u128) / 10000) as u64;
        let carry_amount = ((jackpot_value as u128) * (carry_bps as u128) / 10000) as u64;

        let community_amount = ((jackpot_value as u128) * 200 / 10000) as u64;
        let winner_div_amount = ((jackpot_value as u128) * 4800 / 10000) as u64;

        // Execute splits in order: community first, then player div, carry, winner
        let community_balance = balance::split(&mut game.jackpot, community_amount);
        let player_div_balance = balance::split(&mut game.jackpot, player_div_amount);
        let carry_balance = balance::split(&mut game.jackpot, carry_amount);
        let mut winner_balance = balance::split(&mut game.jackpot, winner_div_amount);

        // Integer division dust goes to winner
        let dust = balance::value(&game.jackpot);
        if (dust > 0) {
            let dust_balance = balance::split(&mut game.jackpot, dust);
            balance::join(&mut winner_balance, dust_balance);
        };

        // Add player dividends to pool and update accumulator
        balance::join(&mut game.player_dividend_pool, player_div_balance);

        if (game.total_tickets_sold > 0) {
            let increment = ((player_div_amount as u128) * (PRECISION as u128) / (game.total_tickets_sold as u128)) as u64;
            game.dividend_per_ticket = game.dividend_per_ticket + increment;
        };

        // Add to community fund
        balance::join(&mut game.community_fund, community_balance);

        // Emit event
        event::emit(RoundEnded {
            round: game.round,
            winner,
            winner_team,
            jackpot_amount,
            total_tickets_sold: total_keys,
            total_volume,
        });

        // Pay winner
        let winner_coin = coin::from_balance(winner_balance, ctx);
        transfer::public_transfer(winner_coin, winner);

        // Start new round
        game.round = game.round + 1;
        game.round_start_ts = now_ms;
        game.timer_end_ts = now_ms + TIMER_MAX_MS;
        game.last_buyer = @0x0;
        game.last_buyer_team = TEAM_DOGE;
        game.total_tickets_sold = 0;
        game.airdrop_chance_bps = AIRDROP_CHANCE_BASE;

        // Reset team stats
        game.team_tickets = vector[0, 0, 0, 0];
        game.team_players = vector[0, 0, 0, 0];
        game.team_volume = vector[0, 0, 0, 0];

        // Carry over balance becomes the new jackpot
        balance::join(&mut game.jackpot, carry_balance);
    }

    /// Admin withdraws community fund.
    entry fun withdraw_community_fund(
        game: &mut Game,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        assert!(tx_context::sender(ctx) == game.admin, E_UNAUTHORIZED);
        let fund = balance::split(&mut game.community_fund, amount);
        let fund_coin = coin::from_balance(fund, ctx);
        transfer::public_transfer(fund_coin, game.admin);
    }

    /// Admin seeds the initial jackpot. Only works when no tickets have been sold yet.
    entry fun seed_jackpot(
        game: &mut Game,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        assert!(tx_context::sender(ctx) == game.admin, E_UNAUTHORIZED);
        assert!(game.total_tickets_sold == 0, E_ROUND_ENDED);
        let amount = coin::value(&payment);
        balance::join(&mut game.jackpot, coin::into_balance(payment));
        // Set timer so the round can actually end
        let now_ms = clock::timestamp_ms(clock);
        if (game.timer_end_ts == 0xFFFFFFFFFFFFFFFF) {
            game.timer_end_ts = now_ms + TIMER_MAX_MS;
        };
        game.total_sui_volume = game.total_sui_volume + amount;
    }

    /// Admin: pause the game. No new buys or claims while paused.
    entry fun pause_game(
        game: &mut Game,
        ctx: &mut TxContext,
    ) {
        assert!(tx_context::sender(ctx) == game.admin, E_UNAUTHORIZED);
        game.paused = true;
    }

    /// Admin: unpause the game.
    entry fun unpause_game(
        game: &mut Game,
        ctx: &mut TxContext,
    ) {
        assert!(tx_context::sender(ctx) == game.admin, E_UNAUTHORIZED);
        game.paused = false;
    }

    // ─── Internal Functions ───────────────────────────────

    fun buy_tickets_internal(
        game: &mut Game,
        player: &mut Player,
        payment: Coin<SUI>,
        team: u8,
        tickets: u64,
        referrer: address,
        clock: &Clock,
        rng: &Random,
        ctx: &mut TxContext,
    ) {
        assert!(team <= TEAM_CAT, E_INVALID_TEAM);
        assert!(tickets > 0 && tickets <= MAX_TICKETS_PER_TX, E_INVALID_TICKETS);

        let now_ms = clock::timestamp_ms(clock);

        // Only initialize timer on first-ever purchase (after create_game).
        // Auto-settlement and seed_jackpot already set a proper timer_end_ts.
        if (game.timer_end_ts == 0xFFFFFFFFFFFFFFFF) {
            game.round_start_ts = now_ms;
            game.timer_end_ts = now_ms + TIMER_MAX_MS;
        };

        assert!(!is_round_expired(game, now_ms), E_ROUND_ENDED);

        // Claim dividends from previous round before resetting player state
        if (player.round != game.round && player.tickets_owned > 0) {
            let owed = calculate_dividends(game, player);
            if (owed > 0) {
                let reward = balance::split(&mut game.player_dividend_pool, owed);
                let reward_coin = coin::from_balance(reward, ctx);
                transfer::public_transfer(reward_coin, player.owner);
            };
        };

        // Reset player if they're from a previous round
        if (player.round != game.round) {
            player.tickets_owned = 0;
            player.last_dividend_per_ticket = 0;
            player.team_id = team;
            player.round = game.round;
            player.counted_teams = 0;
        };

        // Calculate total cost
        let total_cost = calculate_total_cost(game.total_tickets_sold, tickets);
        let paid = coin::value(&payment);
        assert!(paid >= total_cost, E_INSUFFICIENT_PAYMENT);

        let mut payment_balance = coin::into_balance(payment);

        // Refund excess payment
        if (paid > total_cost) {
            let excess = paid - total_cost;
            let excess_balance = balance::split(&mut payment_balance, excess);
            let excess_coin = coin::from_balance(excess_balance, ctx);
            transfer::public_transfer(excess_coin, tx_context::sender(ctx));
        };

        // Split the payment into allocations
        let player_div_bps = get_player_div_bps(team);

        // 1. Referral: 10% (1000 bps). If no referrer, goes to player dividend pool
        let referral_amount = (total_cost * 1000) / 10000;
        let referral_balance = balance::split(&mut payment_balance, referral_amount);
        if (referrer != @0x0) {
            // Send to referrer
            let referral_coin = coin::from_balance(referral_balance, ctx);
            transfer::public_transfer(referral_coin, referrer);
        } else {
            // No referrer → add to player dividend pool
            balance::join(&mut game.player_dividend_pool, referral_balance);
        };

        // 2. Community fund: 2% (200 bps)
        let community_amount = (total_cost * 200) / 10000;
        let community_balance = balance::split(&mut payment_balance, community_amount);
        balance::join(&mut game.community_fund, community_balance);

        // 3. Airdrop pool: 1% (100 bps)
        let airdrop_amount = (total_cost * 100) / 10000;
        let airdrop_balance = balance::split(&mut payment_balance, airdrop_amount);
        balance::join(&mut game.airdrop_pool, airdrop_balance);

        // After referral(10%), community(2%), airdrop(1%), 87% remains.
        // This 87% splits into: player_div_bps + jackpot_bps + zh_bps = 8700bps total
        let remaining = balance::value(&payment_balance);

        // Player dividend share
        let player_share_of_remaining = ((remaining as u128) * (player_div_bps as u128) / 8700) as u64;
        let player_div_remaining = balance::split(&mut payment_balance, player_share_of_remaining);
        balance::join(&mut game.player_dividend_pool, player_div_remaining);

        // ZH share — credit buyer's internal balance, add SUI to zh_pool
        let zh_bps = get_zh_bps(team);
        if (zh_bps > 0) {
            let zh_amount = ((remaining as u128) * (zh_bps as u128) / 8700) as u64;

            // Claim existing ZH dividends before updating player state
            if (player.zh_balance > 0) {
                let zh_owed = calculate_zh_dividends(game, player);
                if (zh_owed > 0) {
                    let zh_reward = balance::split(&mut game.zh_pool, zh_owed);
                    let zh_reward_coin = coin::from_balance(zh_reward, ctx);
                    transfer::public_transfer(zh_reward_coin, player.owner);
                };
            };

            // Update zh_per_token accumulator before minting new tokens
            if (game.zh_total_supply > 0) {
                let zh_increment = ((zh_amount as u128) * (PRECISION as u128) / (game.zh_total_supply as u128)) as u64;
                game.zh_per_token = game.zh_per_token + zh_increment;
            };

            // Split SUI from payment into zh_pool
            let zh_sui = balance::split(&mut payment_balance, zh_amount);
            balance::join(&mut game.zh_pool, zh_sui);

            // Update player ZH state (internal accounting only — ZH is not a transferable token)
            player.zh_balance = player.zh_balance + zh_amount;
            player.zh_last_per_token = game.zh_per_token;

            game.zh_total_supply = game.zh_total_supply + zh_amount;
        };

        // The rest goes to jackpot
        let jackpot_value = balance::value(&payment_balance);
        let jackpot_remaining = balance::split(&mut payment_balance, jackpot_value);
        balance::join(&mut game.jackpot, jackpot_remaining);

        // Destroy empty payment balance
        balance::destroy_zero(payment_balance);

        // ─── Update dividend per ticket accumulator ──────────
        // Only update if there are existing tickets (dividends go to existing holders, not the new buyer)
        if (game.total_tickets_sold > 0) {
            let new_dividends = player_share_of_remaining;
            let increment = ((new_dividends as u128) * (PRECISION as u128) / (game.total_tickets_sold as u128)) as u64;
            game.dividend_per_ticket = game.dividend_per_ticket + increment;
        };

        // ─── Update game state ────────────────────────────
        game.total_tickets_sold = game.total_tickets_sold + tickets;
        game.total_sui_volume = game.total_sui_volume + total_cost;
        game.last_buyer = player.owner;
        game.last_buyer_team = team;

        // Update team stats
        let team_idx = team as u64;
        *vector::borrow_mut(&mut game.team_tickets, team_idx) =
            *vector::borrow(&game.team_tickets, team_idx) + tickets;
        *vector::borrow_mut(&mut game.team_volume, team_idx) =
            *vector::borrow(&game.team_volume, team_idx) + total_cost;

        // Track unique players per team using bitmask (one bit per team)
        let team_bit = 1 << team;
        if ((player.counted_teams & team_bit) == 0) {
            *vector::borrow_mut(&mut game.team_players, team_idx) =
                *vector::borrow(&game.team_players, team_idx) + 1;
            player.counted_teams = player.counted_teams | team_bit;
        };

        // ─── Update player state ──────────────────────────
        // Claim dividends for player before updating their ticket count
        if (player.tickets_owned > 0) {
            let owed = calculate_dividends(game, player);
            if (owed > 0) {
                let reward = balance::split(&mut game.player_dividend_pool, owed);
                let reward_coin = coin::from_balance(reward, ctx);
                transfer::public_transfer(reward_coin, player.owner);
            };
        };

        player.tickets_owned = player.tickets_owned + tickets;
        player.team_id = team;
        player.last_dividend_per_ticket = game.dividend_per_ticket;

        // ─── Extend timer ─────────────────────────────────
        let extension = tickets * TIMER_EXTENSION_MS_PER_TICKET;
        let new_end = game.timer_end_ts + extension;
        if (new_end > now_ms + TIMER_MAX_MS) {
            game.timer_end_ts = now_ms + TIMER_MAX_MS;
        } else {
            game.timer_end_ts = new_end;
        };

        // ─── Airdrop ──────────────────────────────────────
        try_airdrop_internal(game, total_cost, rng, ctx);

        // ─── Emit event ───────────────────────────────────
        event::emit(TicketPurchased {
            round: game.round,
            buyer: player.owner,
            team,
            tickets,
            amount: total_cost,
            new_timer_end_ts: game.timer_end_ts,
            total_tickets: game.total_tickets_sold,
        });
    }

    /// Calculate owed dividends for a player
    fun calculate_dividends(game: &Game, player: &Player): u64 {
        if (player.tickets_owned == 0) return 0;
        let accumulated = game.dividend_per_ticket;
        let checkpoint = player.last_dividend_per_ticket;
        if (accumulated <= checkpoint) return 0;
        let diff = accumulated - checkpoint;
        // Safe multiplication with u128
        let owed = (((player.tickets_owned as u128) * (diff as u128)) / (PRECISION as u128)) as u64;
        owed
    }

    /// Calculate owed ZH dividends (in SUI) for a player
    fun calculate_zh_dividends(game: &Game, player: &Player): u64 {
        if (player.zh_balance == 0) return 0;
        let accumulated = game.zh_per_token;
        let checkpoint = player.zh_last_per_token;
        if (accumulated <= checkpoint) return 0;
        let diff = accumulated - checkpoint;
        (((player.zh_balance as u128) * (diff as u128)) / (PRECISION as u128)) as u64
    }

    /// Calculate total cost for buying `tickets` starting from `current_total` tickets sold
    fun calculate_total_cost(current_total: u64, tickets: u64): u64 {
        // Sum of arithmetic series: n/2 * (2*first + (n-1)*d)
        // first_price = TICKET_PRICE_BASE + current_total * TICKET_PRICE_INCREMENT
        // last_price = TICKET_PRICE_BASE + (current_total + tickets - 1) * TICKET_PRICE_INCREMENT
        let first_price = TICKET_PRICE_BASE + (current_total * TICKET_PRICE_INCREMENT);
        let last_price = TICKET_PRICE_BASE + ((current_total + tickets - 1) * TICKET_PRICE_INCREMENT);
        // total = tickets * (first_price + last_price) / 2
        let total = ((tickets as u128) * ((first_price + last_price) as u128)) / 2;
        total as u64
    }

    /// Internal airdrop logic
    fun try_airdrop_internal(
        game: &mut Game,
        purchase_amount: u64,
        rng: &Random,
        ctx: &mut TxContext,
    ) {
        // Only purchases >= AIRDROP_QUALIFY_MIN participate
        if (purchase_amount < AIRDROP_QUALIFY_MIN) return;
        if (balance::value(&game.airdrop_pool) == 0) return;

        // Create random generator from the global Random object
        let mut generator = random::new_generator(rng, ctx);

        // Roll the dice: generate a random u64 and mod by 10000 for basis point granularity
        let roll = generator.generate_u64() % 10000;

        if (roll < game.airdrop_chance_bps) {
            // Winner!
            // Determine tier based on purchase amount
            let tier_bps = if (purchase_amount >= 10 * ONE_SUI) {
                7500  // 75% of airdrop pool
            } else if (purchase_amount >= ONE_SUI) {
                5000  // 50%
            } else {
                2500  // 25%
            };

            let pool_value = balance::value(&game.airdrop_pool);
            let win_amount = (pool_value * tier_bps) / 10000;

            let win_balance = balance::split(&mut game.airdrop_pool, win_amount);
            let win_coin = coin::from_balance(win_balance, ctx);

            game.airdrop_total_wins = game.airdrop_total_wins + 1;
            game.airdrop_total_paid = game.airdrop_total_paid + win_amount;
            game.airdrop_chance_bps = AIRDROP_CHANCE_BASE; // Reset chance

            event::emit(AirdropWon {
                round: game.round,
                player: tx_context::sender(ctx),
                amount: win_amount,
                purchase_amount,
            });

            transfer::public_transfer(win_coin, tx_context::sender(ctx));
        } else {
            // No win — increase chance for future
            game.airdrop_chance_bps = game.airdrop_chance_bps + AIRDROP_CHANCE_INCREMENT;
            if (game.airdrop_chance_bps > AIRDROP_CHANCE_MAX) {
                game.airdrop_chance_bps = AIRDROP_CHANCE_MAX;
            };
        }
    }

    // ─── Read-Only Functions (for frontend queries) ───────

    /// Get the current ticket price for the next key to be purchased
    public fun current_ticket_price(game: &Game): u64 {
        get_ticket_price(game.total_tickets_sold)
    }

    /// Get cost to buy N tickets at current price
    public fun quote_tickets(game: &Game, tickets: u64): u64 {
        calculate_total_cost(game.total_tickets_sold, tickets)
    }

    /// Get team stats: (tickets, players, volume) for a given team
    public fun get_team_stats(game: &Game, team: u8): (u64, u64, u64) {
        assert!(team <= TEAM_CAT, E_INVALID_TEAM);
        let idx = team as u64;
        (
            *vector::borrow(&game.team_tickets, idx),
            *vector::borrow(&game.team_players, idx),
            *vector::borrow(&game.team_volume, idx),
        )
    }

    /// Get unclaimed dividends for a player
    public fun get_pending_dividends(game: &Game, player: &Player): u64 {
        calculate_dividends(game, player)
    }

    // ─── Test-Only Accessors ───────────────────────────────

    #[test_only]
    public fun round(game: &Game): u64 { game.round }

    #[test_only]
    public fun total_tickets_sold(game: &Game): u64 { game.total_tickets_sold }

    #[test_only]
    public fun tickets_owned(player: &Player): u64 { player.tickets_owned }

    #[test_only]
    public fun team_id(player: &Player): u8 { player.team_id }

    #[test_only]
    public fun divider(): u64 { PRECISION }

    #[test_only]
    public fun error_unauthorized(): u64 { E_UNAUTHORIZED }

    #[test_only]
    public fun error_invalid_team(): u64 { E_INVALID_TEAM }

    #[test_only]
    public fun error_game_paused(): u64 { E_GAME_PAUSED }

    #[test_only]
    public fun is_paused(game: &Game): bool { game.paused }

    #[test_only]
    public fun zh_per_token(game: &Game): u64 { game.zh_per_token }

    #[test_only]
    public fun zh_balance(player: &Player): u64 { player.zh_balance }

    #[test_only]
    public fun zh_total_supply(game: &Game): u64 { game.zh_total_supply }

    #[test_only]
    public fun zh_pool_value(game: &Game): u64 { balance::value(&game.zh_pool) }

    #[test_only]
    public fun jackpot_value(game: &Game): u64 { balance::value(&game.jackpot) }

    #[test_only]
    public fun make_admin_cap(ctx: &mut TxContext): AdminCap {
        AdminCap { id: object::new(ctx) }
    }
}
