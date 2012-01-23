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

# Device Side:
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

=========
Completed
=========
* Style consistency fix
* Import date format issue fix
* Budget system added
* Globalization
* Bug with custom date time picker