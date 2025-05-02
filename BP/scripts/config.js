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
      Accrued_Idle_Threshold: 15,
      Max_Accrued_Claim_Blocks: {
        Default: 80000
      }
    }
  }
}
