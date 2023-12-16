::: danger Under Construction
This page is in active development and may undergo frequent changes.
:::

To have a custom card in your game you will need:

- A card database (`.cdb` file) containing the stats, text and all properties of the card, with its unique passcode/ID.
- A card script (`.lua` file), written using Lua as scripting language. It is the script that contains the instructions on how the effect is executed when it is used. All cards need scripts, except non-Pendulum Normal Monsters.
- Pictures are optional and don't have any effects on how the cards work.

## Programs to use

### To create/edit card scripts:

Since the `.lua` files are just text files any text editor works, but it's a good ideia to use one that provides at least syntax highlight for the Lua language. Some options are:

- Notepad++ (Windows)
- VSCode
- Atom
- Kate Editor (Linux)
- Sublime Text

### To create/edit database:

Any SQL editor works for that, but some softwares that can be used are:

- [DataEditorX](https://github.com/247321453/DataEditorX/blob/master/README.md)
- DB Browser for Sqlite

For Windows users, DataEditorX is the most beginner-friendly program to edit databases and it was designed to work with cdb files.
The page linked above also has intruction to change the language (it defaults to chinese). After you extract it and run the program, it might ask for the download of extra components.

If you are going to use DataEditorX you should be aware that Edopro uses a different set of "Categories" (the filters used to search in "Effect", in deck edit). [This file](https://github.com/NaimSantos/DataEditorX/blob/master/DataEditorX/data/cardinfo_english.txt) has the new changes and also up to date (as much as possible) OTs - the scopes like TCG/OCG/Anime/Manga/custom, etc - used for cards and hexadecimal values for archetypes.

### For pictures:

An example of site that allows you to create the pictures for your cards is the [Neo New card maker](https://yemachu.github.io/cardmaker/)

## Setup

Cards are identified in the database by an unique passcode (or ID). It's recommended that you choose a 9-digits range (XXXYYYZZZ) for your custom cards and keep them only in that range. The following non-extensive list contains the ranges that are currently in use Edopro and should not be used by your custom cards to avoid conflicts:

- Passcodes with up to 8 digits are reserved for official cards.
- Passcodes with 9 digits in the 10ZXXXYYY range are reserved for pre-release TCG/OCG cards
- Passcodes with 9 digits in the 100XXXYYY range are reserved for Video Game cards.
- Passcodes with 9 digits in the 160XXXYYY range are reserved for Rush cards.
- Passcodes with 9 digits in the 300XXXYYY range are reserved for skill cards.
- Passcodes with 9 digits in the 5ZZXXXYYY and 200XXXYYY ranges are reserved for anime/manga cards.

Scripts are identified by the card's passcode. The file name should be `cXXXYYYZZZ.lua` (XXXYYYZZZ being the passcode/ID for that card)

Pictures are also identified by the card's passcode. Both `JPG` and `PNG` formats are supported, so an example of valid picture file is `XXXYYYZZZ.jpg`

### Keeping your files locally

The `expansions` folder can be used to keep all your files for custom cards. Reffrain from adding your cards directly to the cdbs files already there, adding them to their own cdbs so they are easier to manage

- pictures: should be kept in `expansions/pics`. Artworks for field spells can be kept in `expansions/pics/field`.
- databases: should be kept in `expansions`.
- scripts: should be kept in `expansions/script`.
  If needed, custom strings (for example, for counter and archetype names) can be kept in a `string.conf` file, in `expansions`.

If any the mentioned folders don't exist and you can create them.

### Keeping your files in a repository

**WIP**

You have the option to connect your own github repository to your client, so it can obtain updates from that repository automatically. You can see how to structurate your own repository for custom cards [here](https://github.com/NaimSantos/Customs)
