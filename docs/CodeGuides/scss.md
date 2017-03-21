## SCSS/CSS CodeGuide

### Few assumptions:
* Część nazwy klasy pisana z dużej litery oznacza nazwę pliku w którym się ona znajduje (w przypadku, gdy jest to komponent lub obiekt). Ułatwia to wyszukiwanie tej klasy w strukturze SCSS. Inspiracja do używania dużych liter w nazwach klas wzięła sie z Office Fabric. Tam używają tego trochę inaczej, ale koncept spodobał mi się. Mimo że na początku kod wyglądał dość dziwnie to potem jednak ułatwiało mi to pracę, ponieważ nazwa modułu przez użycie dużej litery wydawała się ważniejsza niż nazwa taga html: `<div class="c-Component">Lorem ipsum</div>`
* Nazwa komponentu lub obiektu oddzielana jest od jego elementów podwójnym podkreśleniem - podobnie jak w BEM.
* Modyfikatory lub wartości klas funkcyjnych oddzielane są od ich typów podwójnym myślnikiem ("`--`") - podobnie jak w BEM.
* Nazwa klasy nie powinna odzwierciedlać struktury DOM. Nie ważne jak głęboko znajduje się element obiektu zawsze jego nazwa oddzielona jest "`__`" od nazwy obiektu.
* Jeśli zauważamy że nazwa elementu wewnątrz obiektu/komponentu musi w jakiś sposób być "zagłębiona" oznacza to że prawdopodobnie obiekt/komponent jest zbyt duży i należy podzielić go na mniejsze obiekty/komponenty lub wydzielić w jego wnętrzu nowy obiekt. Można też spróbować utworzyć dla takiego elementu klasę funkcyjną ale tylko pod warunkiem że przewidujemy ponowne jej użycie gdziekolwiek indziej.

### Modular classes:
Dotyczą stylowania bloków strony. Np.: tego jak ma wyglądać artykuł, wykres, menu.

1. **Components** - elementy strony, występujące tylko raz - górne menu (header), stopka (footer), banner hero, modal, etc. Widząc taką klasę jesteśmy zawsze pewni że zmieniając jakieś jej parametry nie zepsujemy czegoś w innym miejscu.

```SCSS
.c-Modal {
  // Modifiers
  &--big {...}

  // Elements
  &__window {...}
  &__content {...}
  &__close {...}
}
```
2. **Objects** - elementy strony powtarzające się - taby, artykuły, nawigacje. Należy zachować większą ostrożność edytując te style ponieważ możemy być prawie pewni że zmiana czegoś może mieć wpływ na wiele miejsc na stronie.
```SCSS
.o-Something {
  &__child {...}
}
```

### Functional classes:
Dotyczą drobnych czynności lub stylowania bardziej generycznego. W tych klasach powinniśmy bardzo uważać na jakiekolwiek zmiany, ponieważ potencjalnie mogą one popsuć bardzo wiele miejsc. Należy też zwracać uwagę aby jedna klasa funkcyjna wykonywała możliwie jak najmniej czynności.

1. **Layout** - klasy dotyczące aspektu układu elementów a nie nadające wyglądu (kolor, tło, obramowanie). Np.: gridy, ustawianie elementu jako blok (display: block), wyrównywanie do prawej lub lewej.
```SCSS
.l-Wrap {...}
```

2. **Utilities** - inne klasy nadające elementowi DOM jakiś parametr, np.: wyrównujące tekst (`u-Text--right`).
```SCSS
.u-Text {
  &--left { text-align: left; }
  &--right { text-align: right; }
}

.u-Msg {
  &--success { color: green; }
  &--error { color: red; }
}
```


3. **Themes** - klasy nadające elementowi uniwersalny styl. Np.: wszystkie bloki (komponenty o obiekty) mają białe tło. Theme w tym momencie mógłby zmienić tło danej sekcji na ciemne przy okazji zmieniając style elementów potomnych tak, aby pasowały do tego stylu, np.: zmiana koloru tekstu z ciemnego na jasny. Zmiany wewnątrz theme'ów dotyczą tylko elementów generycznych a nie klas. Theme nie powinien zatem zmieniać styli nadanych przez inne klasy, np.: .t-Dark .l-Wrap {...}.
```SCSS
.t-Dark {
  background-color: $color-black;

  h1 { color: $color-white; }
  p { color: $color-gray; }
  a { color: $color-blue; }
}
```

4. **States** - klasy nadające stan danego bloku - np.: to że dana zakładka jest aktywna lub dany link prowadzi do miejsca, w którm się znajdujemy. Rozpoczynają się od "is-". klasy te nadawane moga być zarówno w JS jak i bezpośrednio w HTML. Nazwa stanu może dotyczyć konkretnego elementu jak być nadawana wysoko zlokalizowanemu rodzicowi aby móc wpływać na większą część dokumentu.
```SCSS
.o-Something {
  display: none;

  .is-Modal--open & {
    display: block;
  }
}
```