::: danger Under Construction
This page is in active development and may undergo frequent changes.
:::

# Archetypes

[Archetypes](https://yugipedia.com/wiki/Archetype) are defined by the setcode data value in the `.cdb` file, and they are 4 hexadecimal digits long (0x0001 to 0xFFFF). The first of those 4 digits is what is called a "sub-archetype" (an archetype within an archetype, such as "Cyber Dragon", from "Cyber").

## Multiple Archetypes

You simply concatenate (link together) the archetypes in 4-hexadecimal-digit terms. For example, if a card was "Elemental HERO" (`0x3008`), "Neos" (`0x0009`), and "Alien" (`0x000C`), then it could result in 0x30080009000C. (It does not matter the sequence of those archetypes after linking them together, so long as they are all present.)

## Sub-archetypes

As explained above, the sub-archetype is denoted by the first of 4 hexadecimal digits. For example, the sub-archetype of `0x3184` is 3. If that digit would be a(n omitted) zero, then it does not belong to a sub-archetype.

However, something additional to note is that Card.IsSetCard performs a binary AND operation for the sub-archetype digit, instead of an equal comparison. Therefore, `c:IsSetCard(0x3184)` will return **true** for a `0x7184` card, BUT `c:IsSetCard(0x7184)` will return **false** for a `0x3184` card. (Whether an intentional outcome or not is up to you.) This is done with Saber, X-Saber, and XX-Saber (`0xd`, `0x100d`, and `0x300d`, respectively) to give you an official example.

## In Card Scripts
