Recurrance
==========

GTS Syncing
===========

set up so user can buy option to put on different server

First sync on a device options: Overwrite Server, Overwrite Local, Merge (May duplicate transactions)
	- Merge takes server ids and changes them for local

# Account Information:
	- User ID & log in token are all that is stored
	- Log in returns a token that's saved local

# Server Side:
	- page to collect all requests
	- follow logic of database.js to parse through data
	- modify all data objects to include userid token
	- Eventual addition of using web portal
		- Require already active account

# Device Side:
	- System for registring & logging in; update prefs table to add system
	- Sync queue table (splash.js 733)
	- First in. First out.
	- Action: add, edit, del
	- Table: accounts, transactions, transactionCategories, etc
	- Data: json of object to sync
	- Where: where args for edit, delete

# Will Need:
	- Learn service (for HD version)
		- can a service access the Checkbook DB?
		- should service run when Checkbook is closed?
			- what's needed for this to happen, how does a service even work?
	- service will run in background of app and will need to notify app of changes

Phone Mode
==========

Needs to be tested on an actual device to see behaviour. Work on optimizing list loading (ie only when in view).

Phone Mode
==========

Enyo Update
===========

* Update code to run on EnyoJS (2) instead of Enyo 1
* Check performance on canvas spinner, replace with onyx if causing lag
* Convert event chains to enyo.Signals (https://github.com/enyojs/enyo/wiki/Event-Handling)
