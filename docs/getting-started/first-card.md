---
next: false
---

This tutorial will guide you step by step through the process of creating a new card and adding it to _EDOPro_. It more or less follows the typical workflow we use as scripters on the _Project Ignis_ team, whether we are implementing newly-revealed official cards or creating our own custom cards.

To make things more approachable for beginners, we've simplified that workflow slightly. We'll focus on the simplest methods to get things done and won't go into detailed explanations of how everything works.

By the end of the tutorial, you'll have a fully functional, playable card that you can add to your decks and use in local duels.

## The task

We'll be implementing the following card:

<p align="center">
  <img src="./first-card/scholar.png" alt="Scrap Scholar" width="250"/>
</p>

::: info Scrap Scholar

Level 3 EARTH

**[ Psychic / Tuner / Effect ]**

_Once per turn: You can banish 1 card from your hand; destroy 1 other monster you control, and if you do, add 1 "Scrap" card from your Deck to your hand, except "Scrap Scholar". If this card is destroyed by the effect of a "Scrap" card and sent to your GY: You can target 1 other "Scrap" monster in your GY; Special Summon it, then destroy 1 card you control, except "Scrap Scholar". You can only use this effect of "Scrap Scholar" once per turn._

800 ATK / 700 DEF

:::

This is a custom card designed specifically for this tutorial. It has relatively simple effects (which we always recommend for beginners) while still reflecting what one could reasonably expect from a modern _Yu-Gi-Oh!_ card.

It also covers a good amount of some of the most common card effects and mechanics in the game, giving you a solid foundation for things you'll frequently encounter when scripting cards.

<!-- TODO: improve this list -->

The steps we'll cover include:

- Creating a new card database to be loaded in _EDOPro_, and adding the card's entry

- Writing a Lua script that defines its behavior

- Testing the card to ensure everything works as intended

::: warning This tutorial will not include a guide for creating a card image.

We will use a pre-made image as seen above, which was [created using YGOCarder](https://lauqerm.github.io/ygocarder/?data=%7B%22fm%22%3A%22tcg%22%2C%22fr%22%3A%22effect%22%2C%22fo%22%3A%22normal%22%2C%22op%22%3A%7B%22opbd%22%3A100%2C%22oppd%22%3A100%2C%22optx%22%3A100%2C%22opnm%22%3A100%2C%22opbf%22%3A%22%23404040%22%2C%22opab%22%3Atrue%2C%22opnb%22%3Atrue%2C%22opbl%22%3Afalse%7D%2C%22fn%22%3A%5B%5D%2C%22afn%22%3A%22normal%22%2C%22na%22%3A%22Scrap+Scholar%22%2C%22nst%22%3A%22auto%22%2C%22ns%22%3A%7B%22nsft%22%3A%22Default%22%2C%22nsfs%22%3A%22%23000000%22%2C%22nshfs%22%3A%22%23000000%22%2C%22nssc%22%3A%22%23000000%22%2C%22nssoy%22%3A0%2C%22nssox%22%3A0%2C%22nssb%22%3A0%2C%22nshs%22%3Afalse%2C%22nslc%22%3A%22%23000000%22%2C%22nslw%22%3A0%2C%22nsloy%22%3A0%2C%22nslox%22%3A0%2C%22nshl%22%3Afalse%2C%22nsgd%22%3A0%2C%22nscg%22%3A%220.000%7C%23eef10b%2C0.5%7C%23d78025%2C1.000%7C%237e20cf%22%2C%22nshg%22%3Afalse%2C%22nsep%22%3A90%2C%22nsey%22%3A90%2C%22nset%22%3A0%2C%22nshe%22%3Afalse%2C%22nspr%22%3A%22commonB%22%2C%22nspt%22%3A%22none%22%7D%2C%22at%22%3A%22EARTH%22%2C%22sf%22%3A%22NO+ICON%22%2C%22it%22%3A%22auto%22%2C%22st%22%3A3%2C%22sa%22%3A%22right%22%2C%22ar%22%3A%22https%3A%2F%2Fi.imgur.com%2Fh5kXZeC.png%22%2C%22ad%22%3A%22%22%2C%22as%22%3A%22offline%22%2C%22af%22%3Afalse%2C%22arc%22%3A%7B%22aru%22%3A%22%25%22%2C%22ara%22%3A1%2C%22arx%22%3A0%2C%22ary%22%3A0%2C%22arw%22%3A100%2C%22arh%22%3A99.8046875%7D%2C%22hbg%22%3Afalse%2C%22bg%22%3A%22%22%2C%22bgd%22%3A%22%22%2C%22bf%22%3Afalse%2C%22bgs%22%3A%22online%22%2C%22bgt%22%3A%22fit%22%2C%22bgc%22%3A%7B%22bgx%22%3A0%2C%22bgy%22%3A4%2C%22bgw%22%3A100%2C%22bgh%22%3A89.5%2C%22bgu%22%3A%22%25%22%2C%22bga%22%3A1%7D%2C%22lm%22%3A%5B%221%22%2C%223%22%2C%227%22%2C%229%22%5D%2C%22il%22%3Afalse%2C%22ip%22%3Afalse%2C%22pf%22%3A%22effect%22%2C%22pe%22%3A%22%22%2C%22rs%22%3A%224%22%2C%22bs%22%3A%224%22%2C%22psi%22%3A%22medium%22%2C%22ta%22%3A%5B%22Psychic%22%2C%22Tuner%22%2C%22Effect%22%5D%2C%22es%22%3A%7B%22cdtl%22%3A%22veryLoose%22%2C%22efs%22%3A%22auto%22%2C%22eus%22%3A0%7D%2C%22ps%22%3A%7B%22pfs%22%3A%22auto%22%2C%22pus%22%3A0%7D%2C%22ef%22%3A%22Once+per+turn%3A+You+can+banish+1+card+from+your+hand%3B+destroy+1+other+monster+you+control%2C+and+if+you+do%2C+add+1+%5C%22Scrap%5C%22+card+from+your+Deck+to+your+hand%2C+except+%5C%22Scrap+Scholar%5C%22.+If+this+card+is+destroyed+by+the+effect+of+a+%5C%22Scrap%5C%22+card+and+sent+to+your+GY%3A+You+can+target+1+other+%5C%22Scrap%5C%22+monster+in+your+GY%3B+Special+Summon+it%2C+then+destroy+1+card+you+control%2C+except+%5C%22Scrap+Scholar%5C%22.+You+can+only+use+this+effect+of+%5C%22Scrap+Scholar%5C%22+once+per+turn.%22%2C%22si%22%3A%22%22%2C%22atk%22%3A%22800%22%2C%22def%22%3A%22700%22%2C%22pw%22%3A%22%22%2C%22sti%22%3A%22no-sticker%22%2C%22ife%22%3Afalse%2C%22isp%22%3Afalse%2C%22ile%22%3Afalse%2C%22idt%22%3Afalse%2C%22ilc%22%3Afalse%2C%22cr%22%3A%22art+by+SlackerMagician%2C+card+text+by+Project+Ignis%22%2C%22fh%22%3Atrue%2C%22sts%22%3A%5Bfalse%2C%22%23000000%22%2Cfalse%2C%22%23000000%22%5D%2C%22tts%22%3A%5Bfalse%2C%22%23000000%22%2Cfalse%2C%22%23000000%22%5D%2C%22ets%22%3A%5Bfalse%2C%22%23000000%22%2Cfalse%2C%22%23000000%22%5D%2C%22pts%22%3A%5Bfalse%2C%22%23000000%22%2Cfalse%2C%22%23000000%22%5D%2C%22ots%22%3A%5Bfalse%2C%22%23000000%22%2Cfalse%2C%22%23000000%22%5D%2C%22ve%22%3A2%7D), though there will be an explanation on how to add the image to the game.

While the card's stats and effects were designed by _Project Ignis_, the artwork used in the image is from [SlackerMagician](https://www.deviantart.com/slackermagician) and was originally created for their card, ["Scrap Wanderer"](https://www.deviantart.com/slackermagician/art/Scrap-Wanderer-907369948).

:::

## What you'll need

Before we begin, make sure you have the following ready:

- A working copy of _EDOPro_, which you can download [here](https://projectignis.github.io/download.html). Also, make sure you know where your _EDOPro_ folder is located, i.e., the folder that contains `EDOPro.exe`.

- [A way to create and edit card databases](/getting-started/setup/#programs-to-use). We will be using _Datacorn_, which we recommend for its minimal setup and user-friendly interface. However, there will also be an alternative tutorial that uses an SQLite editor if you're unable to use _Datacorn_ or want to explore how to work with raw database values.

- [A way to create and edit scripts](/getting-started/setup/#programs-to-use-1). You are free to use any code editor you are comfortable with, or any of the suggestions listed on that page.

This tutorial assumes at least a basic understanding of _Yu-Gi-Oh!_ rules and terminology. You don't need to be an expert, but if you're unfamiliar with fundamental mechanics such as _Summoning_, _activating an effect_, or _targeting_, it would be difficult to connect what we're doing in each step to what we're trying to accomplish.

Though **not strictly necessary**, some programming knowledge (especially in Lua), would help a lot. While the tutorial aims to be accessible for beginners, it does use programming terms such as _"variable"_ and _"function"_ without explaining them in-depth. If you're new to programming and find the scripting section challenging, you may want to explore some of the following resources:

- [Programming in Lua (official)](https://www.lua.org/pil/contents.html)
- [Learn Lua in Y minutes](https://learnxinyminutes.com/lua/)
- [lua-beginners-guide](https://github.com/gridlocdev/lua-beginners-guide)
- [Lua for Programmers](https://ebens.me/posts/lua-for-programmers-part-1/)
- [lua-users tutorials](http://lua-users.org/wiki/TutorialDirectory)

::: tip Consider joining the [Project Ignis Discord Server](https://discord.gg/ygopro-percy)

We have a dedicated channel, [`card-scripting-101`](https://discord.com/channels/170601678658076672/208066323429720064), where you can ask questions related to card scripting and implementation. Both community members and _Project Ignis_ staff are active there and can provide helpful guidance.

Additionally, you'll gain access to [Searcher](https://github.com/that-hatter/scrapi-searcher), a Discord bot with commands for documentation searching, card lookup, and other scripting tools.

**Neither the channel nor the bot are required for this tutorial**. It's designed to work even if you do not have access to them. However, they can be helpful resources if you get stuck during the tutorial or at any point in your future card scripting journey.

:::

## Deciding the passcode

Before diving in, you will need to decide the card's passcode. As explained in the [passcode overview](/getting-started/setup#passcodes), we recommend a 9-digit number that does not overlap with the ranges used by _EDOPro_'s default cards.

It's also good idea to pick a custom range and keep all your cards within it. We'll only be creating one card for this tutorial, but you can use that range for your custom cards in the future.

For example, you could pick `601YYYZZZ` as your custom range. And since "Scrap Scholar" would be your first custom card in that range, its passcode will be `601000001`. Then, if you wanted to create more custom cards in the future, they'll be `601000002`, `601000003`, and so on.

This tutorial will use `601000001` as the passcode for "Scrap Scholar". You're free to use a different passcode if you want, but you'll need to make sure to keep it consistent across the database and file names as you go through this tutorial.

## To the first step

Once you have everything set up and have decided on a passcode, you're ready to start implementing your very first card.

We'll begin by walking through how to create a new card database and load "Scrap Scholar" into _EDOPro_. You have two options for this step:

- [Using Datacorn](./first-card/adding-datacorn)
- [Using an SQLite editor](./first-card/adding-sqlite)
