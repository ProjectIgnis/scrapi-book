A card in _EDOPro_ is defined by the following three components:

- An entry in a [card database](#to-create-or-edit-database-files) containing the card's properties such as its stats and text.
- A [card script](#to-create-or-edit-card-scripts) that implements how the card behaves in a Duel, _unless it's a non-Pendulum Normal Monster_.
- _Optionally_, a [card image](#to-create-images) that the simulator will use when displaying the card.

Cards are identified by their "passcode" or ID, which must match across the database, script, and image.

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

Since `.cdb` files are actually just [SQLite3](https://www.sqlite.org/) files with a different file extension, you can also use any program that can work directly with _SQLite3_, such as the following:

- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [SQLite Studio](https://sqlitestudio.pl/)

However, unlike with _Datacorn_ and _DataEditorX_, using these will require you to manually calculate the values to enter in each database field, which have their own particular rules. If you choose to work with `.cdb` files this way, a detailed guide of the database schema can be found [here](/guides/general/cdb).

## Card scripts

Card scripts implement a card's behavior in a Duel, mainly consisting of its effects and conditions. The scripts are written in the [Lua](https://www.lua.org/) language. Each card must have its own script, **except non-Pendulum Normal Monsters**.

A script file's name should start with `c` followed by the card's passcode, then the `.lua` file extension. For example, if a card's passcode is `86993168`, then its script's filename should be `c86993168.lua`.

### Programs to use

`.lua` files are just text files, and any text editor can be used to create or edit them. However, it is recommended to use one that provides at least syntax highlighting for Lua. Some options are:

- [Notepad++](https://notepad-plus-plus.org/downloads/)
- [VSCodium](https://vscodium.com/#install) (or regular [VSCode](https://code.visualstudio.com/#alt-downloads))
- [Kate](https://kate-editor.org/get-it/)
- [Sublime Text](https://www.sublimetext.com/download)

## Card images

Card images are **optional** and purely for visual purposes. They do not affect how cards work, but help users easily identify cards. If a card does not have a corresponding image, the simulator will display a placeholder image instead.

If provided, the images should be in `JPG` or `PNG` file format. The default images used by the simulator are 177x254 pixels, and it is recommended to use images with the same dimensions or a similar aspect ratio.

A card image's filename should be the card's passcode followed by the `.jpg` or `.png` file extension. For example, if a card's passcode is `86993168`, then its image's filename should be `86993168.jpg`.

::: info Field images

_EDOPro_ also supports displaying images as the field background while a Field Spell is active. The image is typically the Field Spell's artwork (without the card frame), and must be provided separately from the actual card image.

If provided, these images should also be in `JPG` or `PNG` format, and the recommended dimensions are 512x512 pixels. The filename should also be the Field Spell's passcode followed by `.jpg` or `.png`.

:::

### Programs to use

There are several websites that allow you generate _Yu-Gi-Oh!_ card images. In particular, you could use one of the following:

- [YGOCarder](https://lauqerm.github.io/ygocarder/)
- [Neo New Card maker](https://yemachu.github.io/cardmaker/)

## Where to place the files

The _simplest_ way to add a card to the simulator is through the `expansions` folder found in your local installation folder (the same folder where you can find `EDOPro.exe`).

- **Databases** (`.cdb` files) should be placed in the `expansions` folder. You will also see some of the default `.cdb` files used by _EDOPro_ in that folder. **Refrain from editing those files**; when adding your own cards, you should create a separate `.cdb` file for them instead.
- **Scripts** should be placed in `expansions/script` (meaning the `script` folder inside the `expansions` folder).
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

::: info Storing cards in a Github repository

_EDOPro_ also allows you to keep your files in a [GitHub](https://github.com/) repository, which lets you share your cards to other users, enable auto-updates, and manage your cards in their own folder separate from `expansions`. A guide to setting up a custom repository can be found [here](/guides/general/remote-repo).

:::
