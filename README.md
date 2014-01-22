# Make Valet

NodeJS application that hosts details for your [makes](https://github.com/mozilla/MakeAPI).

## Quick start

1. Clone this repository via git: `git clone https://github.com/mozilla/make-valet.git`
2. Change directory to the repository: `cd make-valet/`
3. Install bower if not already installed: `npm install -g bower`
4. Install dependencies: `npm install`
5. Copy default config to working location: `cp env.dist .env`
6. Edit config file with your favourite text editor. See comments in config file for what each option does
7. Run the server: `node server.js`

## Running make-valet without an Internet connection

make-valet relies upon the [xip.io](http://xip.io) domain to access user subdomains. If you do not have an internet connection available, you'll need to have some other way of setting domains on your local machine.

### Edit your /etc/hosts file

For example, if I'm the user `jon`, you'll need to add an entry for jon.127.0.0.1.xip.io to your local hosts file:

`127.0.0.1 jon.127.0.0.1.xip.io`

The downside of this approach is that you'll need to add a hostname for each user you create locally.

### Run a local DNS resolver

If you're running the make-valet offline with a number of users, you should use a local DNS resolver like [dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html) to scale up to any number of users
