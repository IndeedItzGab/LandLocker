# Frequently Asked Questions
In this page, you will be able to find out your questions.

## How to claim a land with LandLocker?
Currently, you can only claim a land with `/claim` commands. However, I might also implement a feature where you can claim a land with golden shovel.

## How to obtain more claim blocks?
You can obtain more claim blocks by playing overtime, every `accrued claim blocks` will be delivered every 5 minutes. You can adjust how many accrued block it should give per hour in the configuration file, it gives 100 accrued blocks per hour by default. Take note that we have anti-afk that avoiding giving players who is away from their keyboard.
You may also get more blocks with `/adjustbonusclaimblocks` by giving yourself or others a bonus blocks. The same goes with `/setaccruedclaimblocks` to set the accrued block of a certain person. 

## Enabling explosion is permanent until we disable them?
No, enabling explosion in your land with `/claimexplosion` won't be permanently enabled. It will be automatically disabled once the owner of the land logged off or server get shutdown.

## How to use administrative commands?
Starting from LandLocker V1.0.2, player should have the tag "Admin" by using `/tag player Admin`. Therefore, people without admin tag could still execute administrative commands but they couldn't run what it actually does since it has admin filter, so players with "Admin" are the only one who can fully run administrative commands.
> ![IMPORTANT]
> Detecting Administrator may change in the future, stay updated.