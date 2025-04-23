---
publish: true
---

In Go, you can declare a struct inside another struct. This is normally done like so

```go
type Address struct {
	City    string
	Country string
}

type Person struct {
	Name    string
	Address Address // non-embedded
}
```

This make its explicit that Address is a separate field inside of Person. So it goes `Person.Address.City` in order to access fields inside of address.

However you can use embedded structs when you want cleaner and DRY code. 

So that would look like this

```go
type Address struct {
	City    string
	Country string
}

type Person struct {
	Name string
	Address // embedded struct
}
```

	`Person.City // ✅ works - Promoted field`

This allows field of Address to be promoted to Person. Kind of like inheritance-lite though Golang doesn't have inheritance. Instead encourages "composition" over inheritance.

https://chatgpt.com/c/67f633c2-ed44-8009-9eef-abc3ad71a45b

