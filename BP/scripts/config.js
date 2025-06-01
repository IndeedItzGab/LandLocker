// Other configuration will be implemented in the near future.

export const config = {
  commands: {
    namespace: "land"
  },
  LandLocker: {
    Claims: {
      InitialBlocks: 100,
      Claim_Blocks_Accrued_Per_Hour: {
        Default: 100
      },
      Accrued_Idle_Threshold: 60,
      Max_Accrued_Claim_Blocks: {
        Default: 80000
      },
      AutomaticNewPlayerClaimsRadius: 4,
      MinSize: 10, // 10 × 10 = 100 Minimum Claim blocks must used in a claim. To let anyone make a small claims set it to 1
      MinWide: 5,
      InvestigationTool: "minecraft:stick", // **
      ModificationTool: "minecraft:golden_shovel",
    },
    PVP: {
      CombatTimeoutSeconds: 15,
      ProtectPlayersInLandClaims:{
        PlayerOwnedClaims: true, // **
        AdministrativeClaims: true // **
      }
    }
  }
}
