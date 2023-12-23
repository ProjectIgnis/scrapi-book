::: danger Under Construction
This page is in active development and may undergo frequent changes.
:::

## What you will need:

To have a custom card in your game, you will need:

- A card database (`.cdb` file) containing the stats, text and all properties of the card, with its unique passcode/ID.
- A card script (`.lua` file), written using Lua as scripting language. It is the script that contains the instructions on how the effect is executed when it is used. All cards need scripts, except non-Pendulum Normal Monsters.
- Pictures are optional and don't have any effects on how the cards work.

## Programs to use

### To create/edit card scripts:

Since the `.lua` files are just text files, any text editor works, but it's a good idea to use one that provides at least syntax highlight for the Lua language. Some options are:

- [Notepad++](https://notepad-plus-plus.org/downloads/)
- [VSCodium](https://vscodium.com/#install) (or regular [VSCode](https://code.visualstudio.com/#alt-downloads))
- [Kate](https://kate-editor.org/get-it/)
- [Sublime Text](https://www.sublimetext.com/download)

### To create/edit database:

Any SQL editor works for that, but some softwares that can be used are:

- [Datacorn](https://github.com/ProjectIgnis/Datacorn#how-to-download)
- [DataEditorX](https://github.com/247321453/DataEditorX/blob/master/README.md)
- [DB Browser for Sqlite](https://sqlitebrowser.org/)

For Windows users, DataEditorX is the most beginner-friendly program to edit databases and it was designed to work with cdb files.
The page linked above also has instructions to change the language (it defaults to chinese). After you extract it and run the program, it might ask for the download of extra components.

Datacorn is an editor maintained by edopro's team with the goal to replace DEX. And while it is in earlier developement stage, it is a functional editor designed to work with cdbs.

If you are going to use DataEditorX, you should be aware that Edopro uses a different set of "Categories" (the filters used to search in "Effect", in deck edit). [This file](https://github.com/NaimSantos/DataEditorX/blob/master/DataEditorX/data/cardinfo_english.txt) has the new changes, and also up to date (as much as possible) OTs - the scopes like TCG/OCG/Anime/Manga/custom, etc - used for cards, and hexadecimal values for archetypes.

### To create pictures:

Pictures don't have any effect in the game; if you can play without them, the scripts will still be fully functional, but an example of site that allows you to create the pictures for your cards is the [Neo New card maker](https://yemachu.github.io/cardmaker/)

### Selecting your card ID:

Cards are identified in the database by an unique passcode (or ID). The internal card structure holds the passcode in a `uint32_t` type, which allows a maximum ID of 2^32-1 (4294967295) to be stored, but it is recommended that you choose a 9-digits range (XXXYYYZZZ) for your custom cards and keep them only in that range. The following non-exhaustive list contains the ranges that are currently in use Edopro and should not be used by your custom cards to avoid conflicts:

- Passcodes with up to 8 digits are reserved for official cards.
- Passcodes with 9 digits in the 10ZXXXYYY range are reserved for pre-release TCG/OCG cards
- Passcodes with 9 digits in the 100XXXYYY range are reserved for Video Game cards.
- Passcodes with 9 digits in the 160XXXYYY range are reserved for Rush cards.
- Passcodes with 9 digits in the 300XXXYYY range are reserved for skill cards.
- Passcodes with 9 digits in the 5ZZXXXYYY and 200XXXYYY ranges are reserved for anime/manga cards.

Scripts are identified by the card's passcode. The file name should be `cXXXYYYZZZ.lua` (XXXYYYZZZ being the passcode/ID for that card)

Pictures are also identified by the card's passcode. Both `JPG` and `PNG` formats are supported, so an example of valid picture file is `XXXYYYZZZ.jpg` for a card that has XXXYYYZZZ as its ID.

## Setup

### Keeping your files locally:

The `expansions` folder can be used to keep all your files for custom cards. Refrain from adding your cards directly to the cdb files already there; adding them to their own cdbs will make them easier to manage.

- pictures: should be kept in `expansions/pics`. Artworks for field spells can be kept in `expansions/pics/field`.
- databases: should be kept in `expansions`.
- scripts: should be kept in `expansions/script`.
  If needed, custom strings (for example, for counter and archetype names) can be kept in a `strings.conf` file, in `expansions`.

If any of the mentioned folders don't exist, you can create them.

### Keeping your files in a repository:

You have the option to connect your own github repository to your client, so it can obtain updates from that repository automatically.

The structure of the repository should be as follows:

```
/script
/pics
database_file.cdb
strings.conf
```

- `script` is a folder where the script files will be read from.
- `pics` is where the pictures for the cards should be kept. If a field spell needs a picture to be used as background on the field when that card is played, a file with the same name as the picture used for the card should be added to `/pics/field`.
- any number of database files are supported, but they must all be placed in the root of that repository
- strings.conf is optional and should be used when you need to call custom strings that are not in your card's database. It is also used to display the names of custom archetypes in the Card Info area and also to show custom counter names.

To connect the game to your repository, create a file named `user_configs.json` and place it in edopro's `config` folder. The file should be structured like this:

```json
{
  "repos": [
    {
      "url": "github_link_here",
      "repo_name": "name_that_will_be_used_in_edopro's_repository_list",
      "repo_path": "path_where_the_contents_will_be_saved",
      "should_update": true,
      "should_read": true
    }
  ]
}
```

You can see an example [here](https://github.com/NaimSantos/Customs).
