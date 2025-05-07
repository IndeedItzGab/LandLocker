# Available Commands
## Non-Operator/Admin Commands
These commands are meant to be use by anyone with or without the permission level of a operator.
|NAME                 |ALIASES                |PARAMETERS              | DESCRIPTION                                                           |
|---------------------|-----------------------|------------------------|-----------------------------------------------------------------------|
|claim                |                       |[radius]                |Creates a land claim centered at your current location.                |
|abandonclaim         |declaim, unclaim       |                        |Deletes the claim you’re standing in.                                  |
|abandonallclaims     |                       |[arg]                   |Deletes all of your claims.                                            |
|trust                |t                      |\<player\>              |Gives another player permission to edit in your claim.                 |
|containertrust       |ct                     |\<player\>              |Gives a player permission to use your buttons, levers, beds, crafting gear, containers, and animals.|
|accesstrust          |at                     |\<player\>              |Gives a player permission to use your buttons, levers, and beds.       |
|permissiontrust      |pt                     |\<player\>              |Grants a player permission to share his permission level with others.  |
|untrust              |                       |\<player\>              |Revokes any permissions granted to a player in your claim.             |
|claimlist            |                       |                        |Lists a player’s claims and claim block details.                       |
|trustlist            |                       |                        |Lists the permissions for the claim you’re standing in.                |
|claimexplosion       |claimexplosions        |                        |Toggles whether explosives may be used in specific land claim.         |

## Operator/Admin Commands
These commands are meant to be use by operators and cannot be accessible by non-operators.
|NAME                      |ALIASES                |PARAMETERS              | DESCRIPTION                                                           |
|--------------------------|-----------------------|------------------------|-----------------------------------------------------------------------|
|adjustbonusclaimblocks    |acb                    |\<player\> \<count\>    |Adds or subtracts bonus claim blocks for a player.                     |
|adjustbonusclaimblocksall |                       |\<count\>               |Adds or subtracts bonus claim blocks for all online players.           |
|setaccruedclaimblocks     |scb                    |\<player\> \<count\>    |Updates a player’s accrued claim block total.                          |
|deleteclaim               |dl                     |                        |Deletes the claim you’re standing in, even if it’s not your claim.     |
|deleteallclaims           |                       |\<player\>              |Deletes all of another player’s claims.                                |