::: danger Under Construction
This page is in active development and may undergo frequent changes.
:::

## Parameter naming convention

The functions passed to Effect.SetCondition, Effect.SetCost, Effect.SetTarget and Effect.SetOperation usually receive the following parameters:

- `e`: effect
- `tp`: triggering player
- `eg`: event group
- `ep`: event player
- `ev`: event value
- `re`: reason effect
- `r`: reason
- `rp`: reason player

Additionally, costs (passed via Effect.SetCost) receive `chk` and targets (via Effect.SetTarget) receive `chk` and `chkc`:

- chk: check (as in, "activation check"). The core runs the function with chk being 0 when it performs the activation check and with chk being 1 when the effect is activated.
- chkc: used in effects that target cards. This parameter is required so cards that are able to redirect target (e.g. `Cairngorgon, Antiluminescent Knight`) can indentify the effect and what would be a correct new target.

### Commonly used variable names

While Lua allows you to name your variables in almost any way you want, reading scripts for official cards one can notice that there are commonly used variable names. Some and what they usually are used for are the following:

- `g`: group, `sg`: summon group, `dg`: destroy/discard group, `mg`: material group, `rg`: group of cards to be removed/banished or returned
- `tc`: target card, `tg`: target group
- `ct`: count, ammount, number of
- `ft`: (the number of) free zones
- `rc`: reason card (usually defined as `rc=re:GetHandler()`.

Those are the usual meanings, but these variable names can be used in other contexts, and it's up to the user to use these names or not.

## Understanding a card script

Here's an example in Galactic Charity's script:

```lua
--銀河の施し
--Galactic Charity
local s,id=GetID()
function s.initial_effect(c)
	--Activate
	local e1=Effect.CreateEffect(c)
	e1:SetCategory(CATEGORY_DRAW)
	e1:SetType(EFFECT_TYPE_ACTIVATE)
	e1:SetCode(EVENT_FREE_CHAIN)
	e1:SetCountLimit(1,id,EFFECT_COUNT_CODE_OATH)
	e1:SetCondition(s.condition)
	e1:SetCost(s.cost)
	e1:SetTarget(s.target)
	e1:SetOperation(s.activate)
	c:RegisterEffect(e1)
end
s.listed_series={0x7b}
function s.cfilter(c)
	return c:IsFaceup() and c:IsSetCard(0x7b) and c:IsType(TYPE_XYZ)
end
function s.condition(e,tp,eg,ep,ev,re,r,rp)
	return Duel.IsExistingMatchingCard(s.cfilter,tp,LOCATION_MZONE,0,1,nil)
end
function s.cost(e,tp,eg,ep,ev,re,r,rp,chk)
	if chk==0 then return Duel.IsExistingMatchingCard(Card.IsDiscardable,tp,LOCATION_HAND,0,1,e:GetHandler()) end
	Duel.DiscardHand(tp,Card.IsDiscardable,1,1,REASON_COST+REASON_DISCARD,nil)
end
function s.target(e,tp,eg,ep,ev,re,r,rp,chk)
	if chk==0 then return Duel.IsPlayerCanDraw(tp,2) end
	Duel.SetTargetPlayer(tp)
	Duel.SetTargetParam(2)
	Duel.SetOperationInfo(0,CATEGORY_DRAW,nil,0,tp,2)
end
function s.activate(e,tp,eg,ep,ev,re,r,rp)
	local p,d=Duel.GetChainInfo(0,CHAININFO_TARGET_PLAYER,CHAININFO_TARGET_PARAM)
	Duel.Draw(p,d,REASON_EFFECT)
	if e:IsHasType(EFFECT_TYPE_ACTIVATE) then
		local e1=Effect.CreateEffect(e:GetHandler())
		e1:SetType(EFFECT_TYPE_FIELD)
		e1:SetCode(EFFECT_CHANGE_DAMAGE)
		e1:SetProperty(EFFECT_FLAG_PLAYER_TARGET+EFFECT_FLAG_CLIENT_HINT)
		e1:SetDescription(aux.Stringid(id,1))
		e1:SetTargetRange(0,1)
		e1:SetValue(s.val)
		e1:SetReset(RESET_PHASE+PHASE_END,1)
		Duel.RegisterEffect(e1,tp)
	end
end
function s.val(e,re,val,r,rp,rc)
	return math.floor(val/2)
end

```

To verify if the card can be activated, the game first checks the condition, the function called in `e1:SetCondition(s.condition)`.
`s.condition` is said to pass (meaning it returns `true`) if there is at least 1 card in player `tp`'s monster zone that matches the function `s.cfilter`.

Next the game checks for the cost. For that, the function called in `e1:SetCost(s.cost)` is executed. First `chk` is passed as `0` and the line

```lua
if chk==0 then return Duel.IsExistingMatchingCard(Card.IsDiscardable,tp,LOCATION_HAND,0,1,e:GetHandler()) end
```

is executed. In this test, if there is at least 1 card in player `tp`'s hand that can be discarded (except Galactic Charity itself, `e:GetHandler()`) the test is true and the game knows that the cost can be paid.

The following step is to verify the activation legality ("can the player resolve this effect?"). For this, the function defined in `e1:SetTarget(s.target)` is executed. For the activation legality the `chk` parameter here is passed as `0` again and the line

```lua
if chk==0 then return Duel.IsPlayerCanDraw(tp,2) end
```

is executed. Here, if player `tp` can draw 2 cards the test returns true and the game decides that the activation is legal.

After those steps, since condition, cost and activation legality are all true, the player can activate the card. When they do, the cost function is executed once again. Now the `chk` parameter is no longer `0`, so the first line in that function is not executed (because `if chk==0` is false) and instead the game runs the function that will make the player pay the cost (via `Duel.DiscardHand`).

After that, the `s.target` function is executed. The same situation with `chk` happens here: it is passed as `1` so the first line is no longer executed and the game instead only calls the functions Duel.SetTargetPlayer, Duel.SetTargetParam and Duel.SetOperationInfo.

Finally, when the effect resolves, the `s.activate` function is called, executing the actual effect of the card.

## Other insights

After the comments, in the script shown above you have:

The definition of 2 local variables, `s` and `id`, that receive the return values from the `GetID` function:

```lua
local s,id=GetID()
```

`s` will be a card object, and `id` will be an int containing that card's passcode.

The declaration of the initial effect, with only 1 effect in this card `e1`:

```lua
function s.initial_effect(c)
	--Activate
	local e1=Effect.CreateEffect(c)
	...
	c:RegisterEffect(e1)
end
```

The first (and only) effect this card has is defined in `e1`. Here we have:

The category of the effect (defined via Effect.SetCategory):

```lua
e1:SetCategory(CATEGORY_DRAW)
```

This tells the game what the effect includes and it is also used because there are cards that need to detect such categories like Ash Blossom & Joyous Spring (detecting CATEGORY_DRAW and CATEGORY_SEARCH).

The code of the effect (defined via Effect.SetCode):

```lua
e1:SetCode(EVENT_FREE_CHAIN)
```

This tells the game that the card can be activated in a open game state, when no chain is resolving (because Galactic Charity is a normal Spell). Other codes might include any event that the card needs to detect (for example EVENT_SUMMON_SUCCESS)

The amount of times the effect can be used (defined via Effect.SetCountLimit):

```lua
e1:SetCountLimit(1,id,EFFECT_COUNT_CODE_OATH)
```

This tells the game that `e1` can be **activated** once per turn, for the card that has `id` as passcode. If the EFFECT_COUNT_CODE_OATH flag was not there, then the player would be able to **use** the effect once per turn (in Yu-Gi-Oh, "use" counts any attempts to apply that effect, even the ones that were negated, while **activate** will only count the ones that didn't have their activation negated).

Examples:

- `e1:SetCountLimit(1)`: used for effects that say "Once per turn" (per copy of the card);
- `e1:SetCountLimit(1,id)`: used for effects that say "You can only use this effect of CARD_NAME once per turn";
- `e1:SetCountLimit(1,id,EFFECT_COUNT_CODE_DUEL)`: used for effects that say "You can only use this effect of CARD_NAME once per duel".

The condition to be able to activate the card or effect (defined via Effect.SetCondition):

```lua
e1:SetCondition(s.condition)
```

The cost function, that checks if the cost can be paid and also executes such cost (defined via Effect.SetCost):

```lua
e1:SetCost(s.cost)
```

The target function, that performs the activation legality check and also does the actions that must be done during the activation (defined via Effect.SetTarget):

```lua
e1:SetTarget(s.target)
```

The operation function, that executes all the steps that are done when the card or effect **resolves** (defined via Effect.SetOperation):

```lua
e1:SetOperation(s.activate)
```
