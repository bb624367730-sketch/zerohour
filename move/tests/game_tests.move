#[test_only]
module fomo3d_sui::game_tests {
    use fomo3d_sui::game::{Self, Game, Player};
    use fomo3d_sui::zh;
    use sui::test_scenario::{Self, Scenario};
    use sui::sui::SUI;
    use sui::coin::{Self, Coin};
    use sui::clock::{Self, Clock};
    use sui::random::{Self, Random};
    use std::unit_test;

    const ADMIN: address = @0xA;
    const ALICE: address = @0xB;
    const BOB: address = @0xC;
    const ONE_SUI: u64 = 1_000_000_000;

    fun mint(amount: u64, ctx: &mut sui::tx_context::TxContext): Coin<SUI> {
        coin::mint_for_testing<SUI>(amount, ctx)
    }

    // ─── 1. create_game sets correct initial state ─────────

    #[test]
    fun test_create_game_initial_state() {
        let mut scenario = test_scenario::begin(ADMIN);
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            assert!(game::round(&game) == 1, 0);
            assert!(game::total_tickets_sold(&game) == 0, 1);
            let price = game::current_ticket_price(&game);
            assert!(price == 10_000_000, 2); // 0.01 SUI base
            test_scenario::return_shared(game);
        };
        test_scenario::end(scenario);
    }

    // ─── 2. seed_jackpot adds funds and sets timer ─────────

    #[test]
    fun test_seed_jackpot() {
        let mut scenario = test_scenario::begin(ADMIN);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(5 * ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            assert!(game::jackpot_value(&game) == 5 * ONE_SUI, 3);
            test_scenario::return_shared(game);
        };
        test_scenario::end(scenario);
    }

    // ─── 3. buy_tickets_first creates Player ───────────────

    #[test]
    fun test_buy_tickets_first_creates_player() {
        let mut scenario = test_scenario::begin(ADMIN);

        // Random must be created by @0x0 (system address)
        test_scenario::next_tx(&mut scenario, @0x0);
        {
            random::create_for_testing(test_scenario::ctx(&mut scenario));
        };

        // Create game
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        // Seed jackpot
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
        };

        // Alice buys 3 tickets
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let total_cost = game::quote_tickets(&game, 3);
            let payment = mint(total_cost, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 0, 3, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };

        // Verify Alice's Player exists
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let player = test_scenario::take_from_address<Player>(&mut scenario, ALICE);
            assert!(game::tickets_owned(&player) == 3, 5);
            assert!(game::team_id(&player) == 0, 6);
            test_scenario::return_to_address(ALICE, player);
        };
        test_scenario::end(scenario);
    }

    // ─── 4. dividend accumulation ──────────────────────────

    #[test]
    fun test_dividends_from_subsequent_purchase() {
        let mut scenario = test_scenario::begin(ADMIN);

        // Random must be created by @0x0
        test_scenario::next_tx(&mut scenario, @0x0);
        {
            random::create_for_testing(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(5 * ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
        };

        // Alice buys 10 tickets
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let total_cost = game::quote_tickets(&game, 10);
            let payment = mint(total_cost, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 0, 10, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };

        // Bob buys 5 tickets (team Pepper=1)
        test_scenario::next_tx(&mut scenario, BOB);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let total_cost = game::quote_tickets(&game, 5);
            let payment = mint(total_cost, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 1, 5, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };

        // Verify Alice has pending dividends
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let alice_player = test_scenario::take_from_address<Player>(&mut scenario, ALICE);
            let owed = game::get_pending_dividends(&game, &alice_player);
            assert!(owed > 0, 10);
            test_scenario::return_to_address(ALICE, alice_player);
            test_scenario::return_shared(game);
        };
        test_scenario::end(scenario);
    }

    // ─── 5. invalid team aborts ────────────────────────────

    #[test]
    #[expected_failure(abort_code = 0)] // E_INVALID_TEAM
    fun test_invalid_team_aborts() {
        let mut scenario = test_scenario::begin(ADMIN);

        // Random by @0x0
        test_scenario::next_tx(&mut scenario, @0x0);
        {
            random::create_for_testing(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
        };

        // Try with team=99 — should abort
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 99, 1, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };
        test_scenario::end(scenario);
    }

    // ─── 6. only admin can withdraw community fund ─────────

    #[test]
    #[expected_failure]
    fun test_withdraw_community_fund_not_admin() {
        let mut scenario = test_scenario::begin(ADMIN);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        // ALICE (non-admin) tries to withdraw
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            game::withdraw_community_fund(&mut game, 1000, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(game);
        };
        test_scenario::end(scenario);
    }

    // ─── 7. seed only when no tickets sold ─────────────────

    #[test]
    #[expected_failure]
    fun test_seed_fails_after_tickets_sold() {
        let mut scenario = test_scenario::begin(ADMIN);

        // Random by @0x0
        test_scenario::next_tx(&mut scenario, @0x0);
        {
            random::create_for_testing(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
        };

        // First ticket purchase
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let total_cost = game::quote_tickets(&game, 1);
            let payment = mint(total_cost, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 0, 1, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };

        // Try seeding again — should fail
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
        };
        test_scenario::end(scenario);
    }

    // ─── 8. end_round_if_expired settles and starts new round ─

    #[test]
    fun test_end_round_if_expired_works() {
        let mut scenario = test_scenario::begin(ADMIN);

        test_scenario::next_tx(&mut scenario, @0x0);
        { random::create_for_testing(test_scenario::ctx(&mut scenario)); };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
        };

        // Alice buys 1 ticket
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let total_cost = game::quote_tickets(&game, 1);
            let payment = mint(total_cost, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 0, 1, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };

        // Advance clock past round end (25 hours)
        test_scenario::next_tx(&mut scenario, BOB);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            clock::set_for_testing(&mut clock, 25 * 60 * 60 * 1000);
            game::end_round_if_expired(&mut game, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            // New round started
            assert!(game::round(&game) == 2, 10);
            assert!(game::total_tickets_sold(&game) == 0, 11);
            test_scenario::return_shared(game);
        };

        test_scenario::end(scenario);
    }

    // ─── 9. auto-settle triggers on buy_tickets ──────────────

    #[test]
    fun test_auto_settle_triggers_on_buy() {
        let mut scenario = test_scenario::begin(ADMIN);

        test_scenario::next_tx(&mut scenario, @0x0);
        { random::create_for_testing(test_scenario::ctx(&mut scenario)); };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
        };

        // Alice buys 1 ticket (becomes last buyer)
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let total_cost = game::quote_tickets(&game, 1);
            let payment = mint(total_cost, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 0, 1, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };

        // Advance clock past round end (25 hours)
        test_scenario::next_tx(&mut scenario, BOB);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            // Mint generous amount — auto-settlement resets pricing so quota is stale
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            clock::set_for_testing(&mut clock, 25 * 60 * 60 * 1000);
            game::buy_tickets_first(
                &mut game, payment, 0, 1, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            // Round should be 2 (auto-settled from 1)
            assert!(game::round(&game) == 2, 12);
            test_scenario::return_shared(game);
        };

        test_scenario::end(scenario);
    }

    // ─── 10. auto-settle triggers on claim_dividends ─────────

    #[test]
    fun test_auto_settle_triggers_on_claim() {
        let mut scenario = test_scenario::begin(ADMIN);

        test_scenario::next_tx(&mut scenario, @0x0);
        { random::create_for_testing(test_scenario::ctx(&mut scenario)); };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
        };

        // Alice buys 1 ticket
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let total_cost = game::quote_tickets(&game, 1);
            let payment = mint(total_cost, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 0, 1, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };

        // Advance clock past round end (25 hours)
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let mut alice = test_scenario::take_from_address<Player>(&mut scenario, ALICE);
            let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            clock::set_for_testing(&mut clock, 25 * 60 * 60 * 1000);
            // claim_dividends should not abort even though round expired
            // (auto-settlement happens first)
            game::claim_dividends(&mut game, &mut alice, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            // Round should be 2
            assert!(game::round(&game) == 2, 13);
            test_scenario::return_shared(game);
            test_scenario::return_to_address(ALICE, alice);
        };

        test_scenario::end(scenario);
    }

    // ─── 11. pause blocks buy_tickets ──────────────────────

    #[test]
    #[expected_failure(abort_code = 9)] // E_GAME_PAUSED
    fun test_pause_blocks_buy() {
        let mut scenario = test_scenario::begin(ADMIN);

        test_scenario::next_tx(&mut scenario, @0x0);
        { random::create_for_testing(test_scenario::ctx(&mut scenario)); };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        // Seed jackpot
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
        };

        // Admin pauses
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            game::pause_game(&mut game, test_scenario::ctx(&mut scenario));
            assert!(game::is_paused(&game), 20);
            test_scenario::return_shared(game);
        };

        // Alice tries to buy — should abort with E_GAME_PAUSED
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let total_cost = game::quote_tickets(&game, 1);
            let payment = mint(total_cost, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 0, 1, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };

        test_scenario::end(scenario);
    }

    // ─── 12. claim still works when paused ──────────────────

    #[test]
    fun test_claim_works_when_paused() {
        let mut scenario = test_scenario::begin(ADMIN);

        test_scenario::next_tx(&mut scenario, @0x0);
        { random::create_for_testing(test_scenario::ctx(&mut scenario)); };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        // Seed + Bob buys (generates dividends for Alice)
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
        };

        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let total_cost = game::quote_tickets(&game, 1);
            let payment = mint(total_cost, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 0, 1, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };

        // Bob buys — generates dividends for Alice
        test_scenario::next_tx(&mut scenario, BOB);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let total_cost = game::quote_tickets(&game, 1);
            let payment = mint(total_cost + ONE_SUI / 10, test_scenario::ctx(&mut scenario)); // generous
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 0, 1, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };

        // Admin pauses
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            game::pause_game(&mut game, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(game);
        };

        // Alice can still claim dividends while paused
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let mut alice = test_scenario::take_from_address<Player>(&mut scenario, ALICE);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            let owed = game::get_pending_dividends(&game, &alice);
            assert!(owed > 0, 21);
            game::claim_dividends(&mut game, &mut alice, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
            test_scenario::return_to_address(ALICE, alice);
        };

        test_scenario::end(scenario);
    }

    // ─── 13. unpause re-enables buying ──────────────────────

    #[test]
    fun test_unpause_allows_buy() {
        let mut scenario = test_scenario::begin(ADMIN);

        test_scenario::next_tx(&mut scenario, @0x0);
        { random::create_for_testing(test_scenario::ctx(&mut scenario)); };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let cap = game::make_admin_cap(test_scenario::ctx(&mut scenario));
            let zh_treasury = zh::make_treasury_cap(test_scenario::ctx(&mut scenario));
            game::create_game(&cap, zh_treasury, test_scenario::ctx(&mut scenario));
            unit_test::destroy(cap);
        };

        // Seed jackpot
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let payment = mint(ONE_SUI, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::seed_jackpot(&mut game, payment, &clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(game);
        };

        // Pause then unpause
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            game::pause_game(&mut game, test_scenario::ctx(&mut scenario));
            game::unpause_game(&mut game, test_scenario::ctx(&mut scenario));
            assert!(!game::is_paused(&game), 22);
            test_scenario::return_shared(game);
        };

        // Alice should be able to buy after unpause (proven by no abort)
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut game = test_scenario::take_shared<Game>(&mut scenario);
            let rng = test_scenario::take_shared<Random>(&mut scenario);
            let total_cost = game::quote_tickets(&game, 1);
            let payment = mint(total_cost, test_scenario::ctx(&mut scenario));
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::buy_tickets_first(
                &mut game, payment, 0, 1, @0x0,
                &clock, &rng, test_scenario::ctx(&mut scenario)
            );
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(rng);
            test_scenario::return_shared(game);
        };

        // Verify player was created
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let alice = test_scenario::take_from_address<Player>(&mut scenario, ALICE);
            assert!(game::tickets_owned(&alice) == 1, 23);
            test_scenario::return_to_address(ALICE, alice);
        };

        test_scenario::end(scenario);
    }
}
