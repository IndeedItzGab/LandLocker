# Configuration
This page provides details about configuring LandLocker from its configuration file located in `BP/scripts/config.js`. Allowing you to adjust available options depending on your preference.

## Table of contents
- [Configuration](#configuration)
  - [Table of contents](#Table-of-contents)
  - [Commands Setting)[#commands-setting)
    - [Changing commands' namespace](#changing-commands-namespace)
  - [Tools](#tools)
    - [Investigation Tool](#investigation-tool)
    - [Modification Tool](#modification-tool)
  - [Claims Setting](#claims-setting)
    - [Given claim blocks for new players](#given-claim-blocks-for-new-players)
    - [Given claim blocks per hour](#given-claim-blocks-per-hour)
    - [Maximum Accrued Blocks for each player](#maximum-accrued-blocks-for-each-player)
    - [Default claim radius uses by /land:claim](#default-claim-radius-uses-by-land-claim)
    - [Minimum size of a claim](#minimum-size-of-a-claim)
    - [Minimum wide of a claim](#minimum-wide-of-a-claim)
  - [PVP](#pvp)
    - [Combat Timeout](#combat-timeout)
    - [Protect players whenever they were in a claim](#protect-players-whenever-they-were-in a-claim)

## Commands Setting
### Changing commands' namespace
`commands.namespace: "land"`

A command's namespace is `/<namespace>:claim`. It's a unique identifier for each add-on that uses custom slash commands.

## Tools
Tools are the items that LandLocker uses to call a function on a certain action. These options were added to ensure that no other add-on that will be conflicted with LandLocker. After changing the option, make sure to also change the messages in `messages.js` that mention the default tool.

### Investigation Tool
`Claims.InvestigationTool: "minecraft:stick`

The investigation tool allows you to view a certain block whether it was claimed by a player or not.

### Modification Tool
`Claims.ModificationTool: "minecraft:golden_shovel"`

The modification tool allows you to resize or create a claim on your preference.

## Claims Setting
### Given claim blocks for new players
`Claims.InitialBlocks: 100`

The number of claim blocks that the new player starts with.

### Given claim blocks per hour
`Claims.ClaimBlockAccruedPerHour: 100`

The number of claim blocks awarded to players for each hour of play time on your server. These are awarded gradually (about every 5 minutes), but only to players who aren’t just standing around doing nothing (idling).

### Maximum Accrued Blocks for each player
`Claims.MaxAccruedBlocks: 80000`

The maximum number of accrued claims blocks any player may amass. This number does not limit bonus claim blocks granted by administrators.

### Default claim radius uses by /land:claim
`Claims.AutomaticNewPlayerClaimsRadius: 4`

When a player claimed a land using `/land:claim` without providing radius. The value of the given option will be the radius of the claim when created. So the default radius 4 would create a 9 x 9 = 81 total blocks claim, centered at the player's location.

### Minimum size of a claim
`Claims.MinSize: 10`

The minimum size for sides of a claim. If you make this very small, griefers may run around creating very tiny claims all over the place just to annoy other players. And then you’ll have to come clean it up. Note that administrative claims (`/land:adminclaims`mode) ignore this rule, so you can use that together with `/land:transferclaim` to create smaller claims on a claim-by-claim basis, as needed.

### Minimum wide of a claim
` Claims.MinWide: 5`

The minimum wide of a claim. If you make this very small, player would be able to make a claim that's very thin. Note that administrative claims ignore this rule, so you can use that together with `/land:transferclaim` to create a thin claims on a claim-by-claim bases, as needes.

## PVP Setting
### Combat Timeout
`PvP.CombatTimeoutSeconds: 15`

The number of seconds after the last PvP damage, during which a player is still considered “in combat”. This prevents him from being invincible when going to a claim that makes a player safe in combat or after dropping his items marking him as an empty inventory player that also makes him safe in combat.

### Protect players whenever they were in a claim
`PVP.ProtectPlayersInLandClaims.PlayerOwnedClaims: true` & `PVP.ProtectPlayersInLandClaims.AdministrativeClaims: true`

Both option serve the same purpose. `PlayerOwnedClaims` is responsible for keeping players safe in combat in a non-administrative claims.Therefore, the `AdministrativeClaims` keeps players safe in combat in a administrative claims.
