// Not all messages from GriefPrevention are implemented.
// All this messages are just similar with GriefPrevention plugin.

export const messages = {
  RespectingClaims: "Now respecting claims.",
  IgnoringClaims: "Now ignoring claims.",
  // **
  NoCreativeUnClaim: "You can't unclaim this land.  You can only make this claim larger or create additional claims.", 
  SuccessfulAbandon: "Claims abandoned.  You now have {0} available claim blocks.",
  TransferClaimPermission: "That command requires the administrative claims permission.",
  TransferClaimMissing: "There's no claim here.  Stand in the administrative claim you want to transfer.",
  TransferClaimAdminOnly: "Only administrative claims may be transferred to a player.",
  PlayerNotFound2: "No player by that name has logged in recently.",
  // **
  TransferTopLevel: "Only top level claims (not subdivisions) may be transferred.  Stand outside of the subdivision and try again.",
  TransferSuccess: "Claim transferred.",
  TrustListNoClaim: "Stand inside the claim you're curious about.",
  ClearPermsOwnerOnly: "Only the claim owner can clear all permissions.",
  UntrustIndividualAllClaims: "Revoked {0}'s access to ALL your claims.  To set permissions for a single claim, stand inside it.",
  UntrustEveryoneAllClaims: "Cleared permissions in ALL your claims.  To set permissions for a single claim, stand inside it.",
  NoPermissionTrust: "You don't have {0}'s permission to manage permissions here.",
  ClearPermissionsOneClaim: "Cleared permissions in this claim.  To set permission for ALL your claims, stand outside them.",
  UntrustIndividualSingleClaim: "Revoked {0}'s access to this claim.  To set permissions for an ALL your claims, stand outside them.",
  AdminClaimsMode: "Administrative claims mode active.  Any claims created will be free and editable by other administrators.",
  BasicClaimsMode: "Returned to basic claim creation mode.",
  SubdivisionMode: "Subdivision mode.  Use your shovel to create subdivisions in your existing claims.  Use /basicclaims to exit.",
  // **
  SubdivisionVideo2: "Click for Subdivision Help: {0}",
  DeleteClaimMissing: "There's no claim here.",
  // **
  DeletionSubdivisionWarning: "This claim includes subdivisions.  If you're sure you want to delete it, use /deleteclaim again.",
  DeleteSuccess: "Claim deleted.",
  // **
  CantDeleteAdminClaim: "You don't have permission to delete administrative claims.",
  DeleteAllSuccess: "Deleted all of {0}'s claims.",
  NoDeletePermission: "You don't have permission to delete claims.",
  AllAdminDeleted: "Deleted all administrative claims.",
  AdjustBlocksSuccess: "Adjusted {0}'s bonus claim blocks by {1}.  New total bonus blocks: {2}.",
  AdjustBlocksAllSuccess: "Adjusted all online players' bonus claim blocks by {0}.",
  // **
  NotTrappedHere: "You can build here.  Save yourself.",
  // **
  RescuePending: "If you stay put for 10 seconds, you'll be teleported out.  Please wait.",
  AbandonClaimMissing: "Stand in the claim you want to delete, or consider /abandonallclaims.",
  // **
  NotYourClaim: "This isn't your claim.",
  // **
  DeleteTopLevelClaim: "To delete a subdivision, stand inside it.  Otherwise, use /abandontoplevelclaim to delete this claim and all subdivisions.",
  AbandonSuccess: "Claim abandoned.  You now have {0} available claim blocks.",
  ConfirmAbandonAllClaims: "Are you sure you want to abandon ALL of your claims?  Please confirm with /abandonallclaims confirm",
  CantGrantThatPermission: "You can't grant a permission you don't have yourself.",
  GrantPermissionNoClaim: "Stand inside the claim where you want to grant permission.",
  GrantPermissionConfirmation: "Granted {0} permission to {1} {2}.",
  ManageUniversalPermissionsInstruction: "To manage permissions for ALL your claims, stand outside them.",
  ManageOneClaimPermissionsInstruction: "To manage permissions for a specific claim, stand inside it.",
  CollectivePublic: "the public",
  BuildPermission: "build",
  ContainersPermission: "access containers and animals",
  AccessPermission: "use buttons and levers",
  PermissionsPermission: "manage permissions",
  LocationCurrentClaim: "in this claim",
  LocationAllClaims: "in all your claims",
  PvPImmunityStart: "You're protected from attack by other players as long as your inventory is empty.",
  // **
  DonateItemsInstruction: "To give away the item(s) in your hand, left-click the chest again.",
  // **
  ChestFull: "This chest is full.",
  // **
  DonationSuccess: "Item(s) transferred to chest!",
  // **
  PlayerTooCloseForFire2: "You can't start a fire this close to another player.",
  // **
  TooDeepToClaim: "This chest can't be protected because it's too deep underground.  Consider moving it.",
  // **
  ChestClaimConfirmation: "This chest is protected.",
  // **
  AutomaticClaimNotification: "This chest and nearby blocks are protected from breakage and theft.",
  // **
  AutomaticClaimOtherClaimTooClose: "Cannot create a claim for your chest, there is another claim too close!",
  // **
  UnprotectedChestWarning: "This chest is NOT protected.  Consider using a golden shovel to expand an existing claim or to create a new one.",
  ThatPlayerPvPImmune: "You can't injure defenseless players.",
  CantFightWhileImmune: "You can't fight someone while you're protected from PvP.",
  // **
  NoDamageClaimedEntity: "That belongs to {0}.",
  ShovelBasicClaimMode: "Shovel returned to basic claims mode.",
  RemainingBlocks: "You may claim up to {0} more blocks.",
  // **
  CreativeBasicsVideo2: "Click for Land Claim Help: {0}",
  // **
  SurvivalBasicsVideo2: "Click for Land Claim Help: {0}",
  // **
  TrappedChatKeyword: "trapped;stuck",
  // **
  TrappedInstructions: "Are you trapped in someone's land claim?  Try the /trapped command.",
  // **
  PvPNoDrop: "You can't drop items while in PvP combat.",
  // **
  PvPNoContainers: "You can't access containers during PvP combat.",
  PvPImmunityEnd: "Now you can fight with other players.",
  // **
  NoBedPermission: "{0} hasn't given you permission to sleep here.",
  // **
  NoWildernessBuckets: "You may only dump buckets inside your claim(s) or underground.",
  NoLavaNearOtherPlayer: "You can't place lava this close to {0}.",
  // **
  TooFarAway: "That's too far away.",
  // **
  BlockNotClaimed: "No one has claimed this block.",
  // **
  BlockClaimed: "That block has been claimed by {0}.",
  // **
  NoCreateClaimPermission: "You don't have permission to claim land.",
  // **
  ResizeClaimTooNarrow: "This new size would be too small.  Claims must be at least {0} blocks wide.",
  ResizeNeedMoreBlocks: "You don't have enough blocks for this size.  You need {0} more.",
  ClaimResizeSuccess: "Claim resized.  {0} available claim blocks remaining.",
  ResizeFailOverlap: "Can't resize here because it would overlap another nearby claim.",
  ResizeStart: "Resizing claim.  Use your shovel again at the new location for this corner.",
  ResizeFailWentOutside: "An subdivision can't be resized outside of its parent claim.",
  // **
  ResizeFailOverlapSubdivision: "You can't create a subdivision here because it would overlap another subdivision.  Consider /abandonclaim to delete it, or use your shovel at a corner to resize it.",
  // **
  SubdivisionStart: "Subdivision corner set!  Use your shovel at the location for the opposite corner of this new subdivision.",
  // **
  CreateSubdivisionOverlap: "Your selected area overlaps another subdivision.",
  // **
  SubdivisionSuccess: "Subdivision created!  Use /trust to share it with friends.",
  CreateClaimFailOverlap: "You can't create a claim here because it would overlap your other claim.  Use /abandonclaim to delete it, or use your shovel at a corner to resize it.",
  // **
  CreateClaimFailOverlapOtherPlayer: "You can't create a claim here because it would overlap {0}'s claim.",
  // **
  ClaimsDisabledWorld: "Land claims are disabled in this world.",
  ClaimStart: "Claim corner set!  Use the shovel again at the opposite corner to claim a rectangle of land.  To cancel, put your shovel away.",
  NewClaimTooNarrow: "This claim would be too small.  Any claim must be at least {0} blocks wide.",
  ResizeClaimInsufficientArea: "This claim would be too small.  Any claim must use at least {0} total claim blocks.",
  CreateClaimInsufficientBlocks: "You don't have enough blocks to claim that entire area.  You need {0} more blocks.",
  // **
  AbandonClaimAdvertisement: "To delete another claim and free up some blocks, use /abandonclaim.",
  CreateClaimFailOverlapShort: "Your selected area overlaps an existing claim.",
  CreateClaimSuccess: "Claim created!  Use /trust to share it with friends.",
  // **
  RescueAbortedMoved: "You moved!  Rescue cancelled.",
  OnlyOwnersModifyClaims: "Only {0} can modify this claim.",
  // **
  NoBuildPvP: "You can't build in claims during PvP combat.",
  NoBuildPermission: "You don't have {0}'s permission to build here.",
  NoAccessPermission: "You don't have {0}'s permission to use that.",
  NoContainersPermission: "You don't have {0}'s permission to use that.",
  OwnerNameForAdminClaims: "an administrator",
  UnknownPlayerName: "someone",
  // **
  ClaimTooSmallForEntities: "This claim isn't big enough for that.  Try enlarging it.",
  // **
  TooManyEntitiesInClaim: "This claim has too many entities already.  Try enlarging the claim or removing some animals, monsters, paintings, or minecarts.",
  // **
  YouHaveNoClaims: "You don't have any land claims.",
  // **
  AutoBanNotify: "Auto-banned {0}({1}).  See logs for details.",
  AdjustGroupBlocksSuccess: "Adjusted bonus claim blocks for players with the {0} permission by {1}.  New total: {2}.",
  // **
  InvalidPermissionID: "Please specify a player name, or a permission in [brackets].",
  // **
  HowToClaimRegex: "(^|.*\\W)how\\W.*\\W(claim|protect|lock)(\\W.*|$)",
  // **
  NoBuildOutsideClaims: "You can't build here unless you claim some land first.",
  // **
  PlayerOfflineTime: "  Last login: {0} days ago.",
  BuildingOutsideClaims: "Other players can build here, too.  Consider creating a land claim to protect your work!",
  TrappedWontWorkHere: "Sorry, unable to find a safe location to teleport you to.  Contact an admin.",
  CommandBannedInPvP: "You can't use that command while in PvP combat.",
  NoTeleportPvPCombat: "You can't teleport while fighting another player.",
  NoTNTDamageAboveSeaLevel: "Warning: TNT will not destroy blocks above sea level.",
  NoTNTDamageClaims: "Warning: TNT will not destroy claimed blocks.",
  IgnoreClaimsAdvertisement: "To override, use /ignoreclaims.",
  NoPermissionForCommand: "You don't have permission to do that.",
  ClaimsListNoPermission: "You don't have permission to get information about another player's land claims.",
  ExplosivesDisabled: "This claim is now protected from explosions.  Use /claimexplosions again to disable.",
  ExplosivesEnabled: "This claim is now vulnerable to explosions.  Use /claimexplosions again to re-enable protections.",
  ClaimExplosivesAdvertisement: "To allow explosives to destroy blocks in this land claim, use /claimexplosions.",
  PlayerInPvPSafeZone: "That player is in a PvP safe zone.",
  NoPistonsOutsideClaims: "Warning: Pistons won't move blocks outside land claims.",
  SoftMuted: "Soft-muted {0}.",
  UnSoftMuted: "Un-soft-muted {0}.",
  DropUnlockAdvertisement: "Other players can't pick up your dropped items unless you /unlockdrops first.",
  PickupBlockedExplanation: "You can't pick this up unless {0} uses /unlockdrops.",
  DropUnlockConfirmation: "Unlocked your drops.  Other players may now pick them up (until you die again).",
  DropUnlockOthersConfirmation: "Unlocked {0}'s drops.",
  AdvertiseACandACB: "You may use /acb to give yourself more claim blocks, or /adminclaims to create a free administrative claim.",
  AdvertiseAdminClaims: "You could create an administrative land claim instead using /adminclaims, which you'd share with other administrators.",
  AdvertiseACB: "You may use /acb to give yourself more claim blocks.",
  NotYourPet: "That belongs to {0}.",
  AvoidGriefClaimLand: "Prevent grief!  If you claim your land, you will be grief-proof.",
  BecomeMayor: "Subdivide your land claim and become a mayor!",
  ClaimCreationFailedOverClaimCountLimit: "You've reached your limit on land claims.  Use /abandonclaim to remove one before creating another.",
  CreateClaimFailOverlapRegion: "You can't claim all of this because you're not allowed to build here.",
  ResizeFailOverlapRegion: "You don't have permission to build there, so you can't claim that area.",
  ShowNearbyClaims: "Found {0} land claims.",
  NoChatUntilMove: "Sorry, but you have to move a little more before you can chat.  We get lots of spam bots here.  :)",
  SetClaimBlocksSuccess: "Updated accrued claim blocks.",
  IgnoreConfirmation: "You're now ignoring chat messages from that player.",
  UnIgnoreConfirmation: "You're no longer ignoring chat messages from that player.",
  NotIgnoringPlayer: "You're not ignoring that player.",
  SeparateConfirmation: "Those players will now ignore each other in chat.",
  UnSeparateConfirmation: "Those players will no longer ignore each other in chat.",
  NotIgnoringAnyone: "You're not ignoring anyone.",
  TrustListHeader: "Explicit permissions here:",
  Manage: "Manage",
  Build: "Build",
  Containers: "Containers",
  Access: "Access",
  HasSubclaimRestriction: "This subclaim does not inherit permissions from the parent",
  StartBlockMath: "{0} blocks from play + {1} bonus = {2} total.",
  ClaimsListHeader: "Claims:",
  ContinueBlockMath: " (-{0} blocks)",
  EndBlockMath: " = {0} blocks left to spend",
  NoClaimDuringPvP: "You can't claim lands during PvP combat.",
  UntrustAllOwnerOnly: "Only the claim owner can clear all its permissions.",
  ManagersDontUntrustManagers: "Only the claim owner can demote a manager.",
  PlayerNotIgnorable: "You can't ignore that player.",
  NoEnoughBlocksForChestClaim: "Because you don't have any claim blocks available, no automatic land claim was created for you.  You can use /claimslist to monitor your available claim block total.",
  MustHoldModificationToolForThat: "You must be holding a golden shovel to do that.",
  StandInClaimToResize: "Stand inside the land claim you want to resize.",
  ClaimsExtendToSky: "Land claims always extend to max build height.",
  ClaimsAutoExtendDownward: "Land claims auto-extend deeper into the ground when you place blocks under them.",
  MinimumRadius: "Minimum radius is {0}.",
  RadiusRequiresGoldenShovel: "You must be holding a golden shovel when specifying a radius.",
  ClaimTooSmallForActiveBlocks: "This claim isn't big enough to support any active block types (hoppers, spawners, beacons...).  Make the claim bigger first.",
  TooManyActiveBlocksInClaim: "This claim is at its limit for active block types (hoppers, spawners, beacons...).  Either make it bigger, or remove other active blocks first.",
  BookAuthor: "BigScary",
  BookTitle: "How to Claim Land",
  BookLink: "Click: {0}",
  BookIntro: "Claim land to protect your stuff!  Click the link above to learn land claims in 3 minutes or less.  :)",
  BookTools: "Our claim tools are {0} and {1}.",
  BookDisabledChestClaims: "  On this server, placing a chest will NOT claim land for you.",
  BookUsefulCommands: "Useful Commands:",
  NoProfanity: "Please moderate your language.",
  IsIgnoringYou: "That player is ignoring you.",
  ConsoleOnlyCommand: "That command may only be executed from the server console.",
  WorldNotFound: "World not found.",
  TooMuchIpx: "Sorry, there are too many players logged in with your IP address.",
  StandInSubclaim: "You need to be standing in a subclaim to restrict it",
  SubclaimRestricted: "This subclaim's permissions will no longer inherit from the parent claim",
  SubclaimUnrestricted: "This subclaim's permissions will now inherit from the parent claim",
  NetherPortalTrapDetectionMessage: "It seems you might be stuck inside a nether portal. We will rescue you in a few seconds if that is the case!",
};
