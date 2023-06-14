# Uruchamianie projektu

### API REST w Symfony

Należy w wierszu poleceń przejść do katalogu projektu, a następnie uruchomić komendy poniżej:

```
# Przejscie do katalogu projektu
$ cd QuizApi

# Uruchomienie bazy danych lokalnie
$ docker compose up -d

# Wykonanie migracji do bazy danych
$ php bin/console doctrine:migrations:migrate

# Uruchomienie serwera REST API - Symfony, lokalnie
$ symfony server:start -d
```

### Aplikacja kliencka w React Native

Należy w wierszu poleceń przejść do katalogu projektu, a następnie uruchomić komendy poniżej:

```
# Przejście do katalogu projektu
$ cd QuizApp

# Zainstalować zależności
$ npm install

# Uruchomienie serwera klienckiego Metro - React Native, lokalnie
$ npx react-native start

# Uruchomienie aplikacji na symulatorze, fizycznym urządzeniu Android
$ npx react-native run-android
```

Dodatkowo ze względu na możliwy pojawiający się błąd Error Network Request należy zmienić 
adres IPv4 w katalogu QuizApp w pliku ./src/constants/requestParams.js

```
$ ipconfig /all
# Skopiować adres Wireless LAN adapter Wi-Fi - ipv4, a następnie podmienić w pliku

// Wireless LAN adapter Wi-Fi - ipv4
const IPV4_ADDRESS = '192.168.187.104';
```