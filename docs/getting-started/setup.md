A card in _EDOPro_ is defined by the following three components:

- An entry in a [card database](#card-databases) containing the card's properties such as its stats and text.
- A [card script](#card-scripts) that implements how the card behaves in a duel, _unless it's a non-Pendulum Normal Monster_.
- _Optionally_, a [card image](#card-images) that the simulator will use when displaying the card.

Cards are identified by their [passcode](#passcodes), which must match across the database, script, and image.

This page provides an overview of these components and how a card's passcode ties them together. If you're looking for a step-by-step tutorial on how to add a card to _EDOPro_, consider starting with [this page](first-card) instead.

## Passcodes

Each card has its own unique passcode, also referred to as the card's "ID". A card's passcode determines what script and image it uses.

The maximum passcode allowed is `2^32-1`, or `4294967295`. Furthermore, there are certain passcode ranges that are reserved for default cards (i.e., cards that are included in _EDOPro_ by default and maintained by the _Project Ignis_ team).

| Passcode Range                         | Reserved For              |
| -------------------------------------- | ------------------------- |
| Up to 8 digits                         | Official OCG/TCG cards    |
| `10XYYYZZZ` (9 digits)                 | Pre-release OCG/TCG cards |
| `100YYYZZZ` (9 digits)                 | Video Game cards          |
| `160YYYZZZ` (9 digits)                 | Rush Duel cards           |
| `300YYYZZZ` (9 digits)                 | Skill cards               |
| `200YYYZZZ` and `5XXYYYZZZ` (9 digits) | Anime and Manga cards     |

If you're looking to create custom cards, it is recommended that you choose a 9-digit range (`XXXYYYZZZ`) that does not conflict with any of the ranges above, and keep the passcodes of your cards within that range. For example, you could pick `601YYYZZZ` as your customs' range. This means your custom cards' passcodes will be `601000001`, `601000002`, `601000003`, and so on.

## Card databases

Card databases are files containing card information. They have the `.cdb` file extension, and each `.cdb` file may contain multiple entries.

Each entry in a database represents a different card, identified by its passcode in the `id` field. For example, if a card's passcode is `86993168`, then its entry in the database should have `86993168` under `id`. This ID is what's used to determine which script and image is used for the card.

### Programs to use

The following programs are specialized to work with `.cdb` files, providing an intuitive visual interface for defining cards:

- [Datacorn](https://github.com/ProjectIgnis/Datacorn#how-to-download)
- [DataEditorX](https://github.com/247321453/DataEditorX/blob/master/README.md), often referred to as **DEX**

::: warning Additional _DataEditorX_ setup

If you plan to use _DataEditorX_, you may need to do some additional steps to set it up. Its default language is Chinese, but the page linked above includes instructions on how to change it. The strings it uses are also not up-to-date with _EDOPro_, so you will need to replace `cardinfo_english.txt` with [this file](https://github.com/NaimSantos/DataEditorX/blob/master/DataEditorX/data/cardinfo_english.txt) to have more accurate strings.

:::

Additionally, `.cdb` files are actually just [SQLite3](https://www.sqlite.org/) files with a different file extension. This means you can also use any program that can work directly with _SQLite3_, such as the following:

- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [SQLiteStudio](https://sqlitestudio.pl/)

However, unlike with _Datacorn_ and _DataEditorX_, using these will require you to manually calculate the values to enter in each database field, which have their own particular rules. If you choose to work with `.cdb` files this way, a detailed guide of the database schema can be found [here](/guides/general/cdb).

## Card scripts

Card scripts implement a card's behavior in a duel, mainly consisting of its effects and conditions. The scripts are written in the [Lua](https://www.lua.org/) language. Each card must have its own script, **except non-Pendulum Normal Monsters**.

A script file's name should start with `c` followed by the card's passcode, then the `.lua` file extension. For example, if a card's passcode is `86993168`, then its script's filename should be `c86993168.lua`.

### Programs to use

Since `.lua` files are just text files, any text editor can be used to create or edit them. However, it is recommended to use one that provides at least syntax highlighting for Lua. Some options are:

- [Notepad++](https://notepad-plus-plus.org/downloads/)
- [VSCodium](https://vscodium.com/#install) (or regular [VSCode](https://code.visualstudio.com/#alt-downloads))
- [Kate](https://kate-editor.org/get-it/)
- [Sublime Text](https://www.sublimetext.com/download)

## Card images

Card images are **optional** and purely for visual purposes. They do not affect how cards work, but help users easily identify cards. If a card does not have a corresponding image, the simulator will display a placeholder image instead.

If provided, the images should be in `JPG` or `PNG` file format. The default images used by the simulator are 177x254 pixels. Images with a higher resolution can also be used, but it is recommended to maintain an aspect ratio of approximately 7:10 (width to height).

A card image's filename should be the card's passcode followed by the `.jpg` or `.png` file extension. For example, if a card's passcode is `86993168`, then its image's filename should be `86993168.jpg`.

::: info Field images

_EDOPro_ also supports displaying images as the field background while a Field Spell is active. The image is typically the Field Spell's artwork (without the card frame), and are provided separately from the actual card image.

If provided, these images should also be in `JPG` or `PNG` format. It is recommended to use images with a 1:1 aspect ratio (the default field images are 512x512 pixels).

Just like card images, the filename for field images should also be the Field Spell's passcode, followed by `.jpg` or `.png`.

:::

### Programs to use

There are several tools that allow you to generate _Yu-Gi-Oh!_ card images. In particular, you could use one of the following websites:

- [YGOCarder](https://lauqerm.github.io/ygocarder/)
- [Neo New Card maker](https://yemachu.github.io/cardmaker/)

## Where to place the files

The _simplest_ way to add a card to the simulator is through the `expansions` folder found in your local _EDOPro_ folder (the same folder where you can find `EDOPro.exe`).

- **Databases** (`.cdb` files) should be placed in the `expansions` folder. You will also see some of the default `.cdb` files used by _EDOPro_ in that folder. **Refrain from editing those files**; when adding your own cards, you should create a separate `.cdb` file for them instead.
- **Scripts** (`.lua` files) should be placed in `expansions/script` (meaning the `script` folder inside the `expansions` folder).
- **Images** (`.jpg` or `.png` files) should be placed in `expansions/pics`. Field images should be placed in `expansions/pics/field`.

If any of these folders do not exist, you can create them.

::: danger Check your file and folder names

A common issue when trying to add cards is having subtly mismatched file or folder names. Keep in mind the following:

- `script` should be singular, not `scripts`
- `expansions` should be plural, not `expansion`
- `pics` should be plural, not `pic`
- script files should start with `c`, such as `c86993168.lua`
- image files should **not** start with `c`, such as `86993168.jpg`

:::

::: tip Storing cards in a Github repository

_EDOPro_ also allows you to keep your files in a [GitHub](https://github.com/) repository, which lets you share your cards to other users, enable auto-updates, and manage your cards in their own folder separate from `expansions`. A guide to setting up a custom repository can be found [here](/guides/general/remote-repo).

:::
