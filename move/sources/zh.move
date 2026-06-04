/// ZH token — dividend-bearing token for Fomo3D.
/// Holders earn SUI dividends from every ticket purchase.
module fomo3d_sui::zh {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::url::{Self, Url};

    public struct ZH has drop {}

    fun init(otw: ZH, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency<ZH>(
            otw,
            9, // decimals
            b"ZH",
            b"ZH Token",
            b"Fomo3D Dividend Token — earn SUI from every ticket purchase",
            option::some(url::new_unsafe_from_bytes(b"https://zero-hour.app")),
            ctx,
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
    }

    /// Mint ZH tokens using the TreasuryCap. Only callable from game module.
    public(package) fun mint(
        treasury: &mut TreasuryCap<ZH>,
        amount: u64,
        ctx: &mut TxContext,
    ): Coin<ZH> {
        coin::mint(treasury, amount, ctx)
    }

    #[test_only]
    /// Create a TreasuryCap for testing.
    public fun make_treasury_cap(ctx: &mut TxContext): TreasuryCap<ZH> {
        let (treasury, metadata) = coin::create_currency<ZH>(
            ZH {},
            9,
            b"ZH",
            b"ZH Token",
            b"Test ZH",
            option::none(),
            ctx,
        );
        transfer::public_freeze_object(metadata);
        treasury
    }
}
