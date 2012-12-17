Recurrance
==========

http://www.ietf.org/rfc/rfc2445

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


Checkout Twitter bootstrap


REPORT
Today I switch from Checkbook Beta to Checkbook (finally...) and found a bug during export. When the amount is greater than a million, ex $1,200,000, it will export "1.2M" instead of the real number. When the account is imported the amount becomes $1.2.

PS. I'm not that rich, just my currency is smaller than dollars. For the same reason I'll appreciate if the number after decimal can be set to not shown. It occupies too much space, ex. $986,000.00



Make loading display screen for accounts -> transactions
