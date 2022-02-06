# zero-auth
a (dirty) proof of concept for no password login system, based only on the capability of the use to prove he is legit.

I am not a NodeJS dev so this is shit. I just wanted to try some new mechanism for authentication.

# How it works
At account creation a user gives his username and a public RSA key in PEM format using `ssh-keygen -f id_rsa.pub -e -m pem`.

When the user will try to login, the server generates a random string then encrypt it with the key. At this moment only the user can decrypt it.
A bruteforce approach would take sometimes based on how the complex is the random string.

The user will then have to decrypt the base64 string the server gave him, using his private key.

Finally the server compare the given string with the random generated string to see if the user is who he claims to be.

# test it

generate keys if you have not. (all default, no passphrase)
```
$ ssh-keygen -t rsa -m PEM
```

install dependencies
```
$ npm install
```

start server
```
node index.js
```

in create account
- give a username
- copy the result of `ssh-keygen -f id_rsa.pub -e -m pem`, where id_rsa.pub is your public key.

Then in login
- copy the string given by the server.
- use `node decrypt.js "$(cat id_rsa)" "<text from server>"
- copy the decoded string into the form
- it should send you to login ok
