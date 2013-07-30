# Make Valet

NodeJS application that hosts details for your [makes](https://github.com/mozilla/MakeAPI).

## Quick start

1. Clone this repository via git: `git clone https://github.com/mozilla/make-valet.git`
2. Change directory to the repository: `cd make-valet/`
3. Install dependencies: `npm install`
4. Copy default config to working location: `cp env.dist .env`
5. Edit config file with your favourite text editor. See comments in config file for what each option does
6. Run the server: `node server.js`

### Additional configuration for localhost dev

make-valet is built around the concept that each user gets their own subdomain for their makes. If you're running make-valet on `http://localhost`, you will not be able to use any subdomains unless you add them manually to your `/etc/hosts` file. As an example, if I'm the user `jon` I should add `127.0.0.1 jon.server.localhost` to my `/etc/hosts` file. Add an entry for each user that you're using on your local machine.

### Mascot ###
[Visit our mascot's homepage!](https://www.makes.org/thimble/makevalet)
