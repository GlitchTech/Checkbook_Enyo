var dbArgs = {
		name: "db",
		database: "ext:checkbook-database",
		version: "1",
		debug: ( enyo.fetchAppInfo()['id'].indexOf( "beta" ) > 0 )//Only debug when in Beta versions
	};

var accountSortOptions = [
		{
			caption: $L( "Custom Category" ),
			value: 0,
			menuParent: "accountSortOptions",
			query: "acctCatOrder, acctCategory COLLATE NOCASE, sect_order, acctName COLLATE NOCASE"
		}, {
			caption: $L( "Custom Account" ),
			value: 1,
			menuParent: "accountSortOptions",
			query: "sect_order, acctName COLLATE NOCASE, acctCatOrder, acctCategory COLLATE NOCASE"
		}, {
			caption: $L( "Alphabetical Name" ),
			value: 2,
			menuParent: "accountSortOptions",
			query: "acctName COLLATE NOCASE, acctCategory COLLATE NOCASE"
		}, {
			caption: $L( "Alphabetical Category" ),
			value: 3,
			menuParent: "accountSortOptions",
			query: "acctCategory COLLATE NOCASE, acctName COLLATE NOCASE"
		}
	];

var transactionSortOptions = [];

/** Default Data **/
var defaultAccountCategories = [
		{
			"name": $L( "Checking" ),
			"catOrder": 1,
			"icon": "checkbook_1.png",
			"color": "green"
		}, {
			"name": $L( "Savings" ),
			"catOrder": 2,
			"icon": "safe_1.png",
			"color": "yellow"
		}, {
			"name": $L( "Credit Card" ),
			"catOrder": 3,
			"icon": "credit_card_3.png",
			"color": "red"
		}, {
			"name": $L( "Other" ),
			"catOrder": 4,
			"icon": "coins_3.png",
			"color": "black"
		}
	];

//Remove and use file picker in modify account categories?
var appIcons = [
		/*{//Reserved for recurring events
			"icon": "source/images/calendar.png",
			"value": "calendar.png"
		},*/
		{
			"icon": "source/images/cash_1.png",
			"value": "cash_1.png"
		}, {
			"icon": "source/images/cash_2.png",
			"value": "cash_2.png"
		}, {
			"icon": "source/images/cash_3.png",
			"value": "cash_3.png"
		}, {
			"icon": "source/images/cash_4.png",
			"value": "cash_4.png"
		}, {
			"icon": "source/images/cash_5.png",
			"value": "cash_5.png"
		}, {
			"icon": "source/images/checkbook_1.png",
			"value": "checkbook_1.png"
		}, {
			"icon": "source/images/checkbook_2.png",
			"value": "checkbook_2.png"
		}, {
			"icon": "source/images/coins_1.png",
			"value": "coins_1.png"
		}, {
			"icon": "source/images/coins_2.png",
			"value": "coins_2.png"
		}, {
			"icon": "source/images/coins_3.png",
			"value": "coins_3.png"
		}, {
			"icon": "source/images/coins_4.png",
			"value": "coins_4.png"
		}, {
			"icon": "source/images/credit_card_1.png",
			"value": "credit_card_1.png"
		}, {
			"icon": "source/images/credit_card_2.png",
			"value": "credit_card_2.png"
		}, {
			"icon": "source/images/credit_card_3.png",
			"value": "credit_card_3.png"
		}, {
			"icon": "source/images/dollar_sign_1.png",
			"value": "dollar_sign_1.png"
		}, {
			"icon": "source/images/dollar_sign_2.png",
			"value": "dollar_sign_2.png"
		}, {
			"icon": "source/images/dollar_sign_3.png",
			"value": "dollar_sign_3.png"
		}, {
			"icon": "source/images/echeck.png",
			"value": "echeck.png"
		}, {
			/*
			//Reserved for recurring transfers
			"icon": "source/images/future_transfer_1.png",
			"value": "future_transfer_1.png"
		}, {
			*/
			"icon": "source/images/icon_1.png",
			"value": "icon_1.png"
		}, {
			"icon": "source/images/icon_2.png",
			"value": "icon_2.png"
		}, {
			"icon": "source/images/icon_3.png",
			"value": "icon_3.png"
		}, {
			"icon": "source/images/icon_4.png",
			"value": "icon_4.png"
		}, {
			"icon": "source/images/jewel_1.png",
			"value": "jewel_1.png"
		}, {
			"icon": "source/images/jewel_2.png",
			"value": "jewel_2.png"
		}, {
			"icon": "source/images/money_bag_1.png",
			"value": "money_bag_1.png"
		}, {
			"icon": "source/images/money_bag_2.png",
			"value": "money_bag_2.png"
		}, {
			"icon": "source/images/money_bag_3.png",
			"value": "money_bag_3.png"
		}, {
			"icon": "source/images/money_bag_4.png",
			"value": "money_bag_4.png"
		}, {
			/*
			//Reserved for locked accounts
			"icon": "source/images/padlock_1.png",
			"value": "padlock_1.png"
		}, {
			*/
			"icon": "source/images/padlock_2.png",
			"value": "padlock_2.png"
		}, {
			"icon": "source/images/safe_1.png",
			"value": "safe_1.png"
		}, {
			"icon": "source/images/safe_2.png",
			"value": "safe_2.png"
		}, {
			"icon": "source/images/transfer_1.png",
			"value": "transfer_1.png"
		}, {
			"icon": "source/images/transfer_2.png",
			"value": "transfer_2.png"
		}, {
			/*//Reserved for transfers
			"icon": "source/images/transfer_3.png",
			"value": "transfer_3.png"
		}, {
			*/
			"icon": "source/images/transfer_4.png",
			"value": "transfer_4.png"
		}
	];

var appColors = [
		{ caption: "Black", className: "custom-background black legend", name: "black" },
		{ caption: "Blue", className: "custom-background blue legend", name: "blue" },
		{ caption: "Green", className: "custom-background green legend", name: "green" },
		{ caption: "Orange", className: "custom-background orange legend", name: "orange" },
		{ caption: "Pink", className: "custom-background pink legend", name: "pink" },
		{ caption: "Purple", className: "custom-background purple legend", name: "purple" },
		{ caption: "Red", className: "custom-background red legend", name: "red" },
		{ caption: "Teal", className: "custom-background teal legend", name: "teal" },
		{ caption: "Yellow", className: "custom-background yellow legend", name: "yellow" }
	];

var defaultAcctTrsnSortOptn =	[
		{/*
			//Disabled for now, going to bottom of list eats the processor
			"sortGroup": $L( "Date" ),
			"groupOrder": 0,
			"label": $L( "Oldest to Newest, Show Newest" ),
			"desc": $L( "Sorts transactions from oldest to newest. Displays the newest transactions." ),
			"qry": "date ASC, itemId ASC",
			"sortId": 0
		}, {*/
			"sortGroup": $L( "Date" ),
			"groupOrder": 0,
			"label": $L( "Newest to Oldest, Show Newest" ),
			"desc": $L( "Sorts transactions from newest to oldest. Displays the newest transactions." ),
			"qry": "date DESC, itemId DESC",
			"sortId": 1
		}, {
			"sortGroup": $L( "Date" ),
			"groupOrder": 0,
			"label": $L( "Oldest to Newest, Show Oldest" ),
			"desc": $L( "Sorts transactions from oldest to newest. Displays the oldest transactions." ),
			"qry": "date ASC, itemId ASC",
			"sortId": 8
		},

		{
			"sortGroup": $L( "Description" ),
			"groupOrder": 1,
			"label": $L( "A-Z" ),
			"desc": $L( "Sorts transactions from A to Z. Displays the newest transactions." ),
			"qry": "desc COLLATE NOCASE ASC, itemId ASC",
			"sortId": 2
		}, {
			"sortGroup": $L( "Description" ),
			"groupOrder": 1,
			"label": $L( "Z-A" ),
			"desc": $L( "Sorts transactions from A to Z. Displays the newest transactions." ),
			"qry": "desc COLLATE NOCASE DESC, itemId ASC",
			"sortId": 3
		},

		{
			"sortGroup": $L( "Amount" ),
			"groupOrder": 2,
			"label": $L( "Ascending" ),
			"desc": $L( "Sorts transactions by amount, ascending. Displays the greatest expense." ),
			"qry": "amount ASC, itemId ASC",
			"sortId": 4
		}, {
			"sortGroup": $L( "Amount" ),
			"groupOrder": 2,
			"label": $L( "Descending" ),
			"desc": $L( "Sorts transactions by amount, descending. Displays the greatest income." ),
			"qry": "amount DESC, itemId ASC",
			"sortId": 5
		},

		{
			"sortGroup": $L( "Status" ),
			"groupOrder": 3,
			"label": $L( "Cleared first" ),
			"desc": $L( "Sorts transactions by cleared status with Cleared transactions first. Transactions are then sorted by date from newest to oldest." ),
			"qry": "cleared DESC, date ASC, itemId ASC",
			"sortId": 6
		}, {
			"sortGroup": $L( "Status" ),
			"groupOrder": 3,
			"label": $L( "Pending first" ),
			"desc": $L( "Sorts transactions by cleared status with Uncleared transactions first. Transactions are then sorted by date from newest to oldest." ),
			"qry": "cleared ASC, date DESC, itemId ASC",
			"sortId": 7
		},

		{
			"sortGroup": $L( "Check Number" ),
			"groupOrder": 4,
			"label": $L( "Ascending Numbers" ),
			"desc": $L( "Sorts transactions by check number. Displays the lowest numbered check first. Transactions without check numbers are sorted last." ),
			"qry": "IFNULL( NULLIF( checkNum, '' ), ( SELECT IFNULL( MAX( checkNum ), 0 ) FROM expenses LIMIT 1 ) ) ASC, itemId ASC",
			"sortId": 9
		}, {
			"sortGroup": $L( "Check Number" ),
			"groupOrder": 4,
			"label": $L( "Descending Numbers" ),
			"desc": $L( "Sorts transactions by check number. Displays the highest numbered check first. Transactions without check numbers are sorted last." ),
			"qry": "checkNum DESC, itemId ASC",
			"sortId": 10
		}
	];

var defaultExpenseCategories = [
		{
			"genCat": $L( "Auto & Transport" ),
			"specCat": $L( "Auto Insurance" )
		}, {
			"genCat": $L( "Auto & Transport" ),
			"specCat": $L( "Auto Payment" )
		}, {
			"genCat": $L( "Auto & Transport" ),
			"specCat": $L( "Gas & Fuel" )
		}, {
			"genCat": $L( "Auto & Transport" ),
			"specCat": $L( "Parking" )
		}, {
			"genCat": $L( "Auto & Transport" ),
			"specCat": $L( "Public Transportation" )
		}, {
			"genCat": $L( "Auto & Transport" ),
			"specCat": $L( "Service & Parts" )
		}, {
			"genCat": $L( "Auto & Transport" ),
			"specCat": $L( "Car Wash" )
		}, {
			"genCat": $L( "Bills & Utilities" ),
			"specCat": $L( "Home Phone" )
		}, {
			"genCat": $L( "Bills & Utilities" ),
			"specCat": $L( "Internet" )
		}, {
			"genCat": $L( "Bills & Utilities" ),
			"specCat": $L( "Mobile Phone" )
		}, {
			"genCat": $L( "Bills & Utilities" ),
			"specCat": $L( "Television" )
		}, {
			"genCat": $L( "Bills & Utilities" ),
			"specCat": $L( "Utilities" )
		}, {
			"genCat": $L( "Business Services" ),
			"specCat": $L( "Advertising" )
		}, {
			"genCat": $L( "Business Services" ),
			"specCat": $L( "Legal" )
		}, {
			"genCat": $L( "Business Services" ),
			"specCat": $L( "Office Supplies" )
		}, {
			"genCat": $L( "Business Services" ),
			"specCat": $L( "Printing" )
		}, {
			"genCat": $L( "Business Services" ),
			"specCat": $L( "Shipping" )
		}, {
			"genCat": $L( "Education" ),
			"specCat": $L( "Books & Supplies" )
		}, {
			"genCat": $L( "Education" ),
			"specCat": $L( "Student Loan" )
		}, {
			"genCat": $L( "Education" ),
			"specCat": $L( "Tuition" )
		}, {
			"genCat": $L( "Entertainment" ),
			"specCat": $L( "Amusement" )
		}, {
			"genCat": $L( "Entertainment" ),
			"specCat": $L( "Arts" )
		}, {
			"genCat": $L( "Entertainment" ),
			"specCat": $L( "Movies & DVDs" )
		}, {
			"genCat": $L( "Entertainment" ),
			"specCat": $L( "Music" )
		}, {
			"genCat": $L( "Entertainment" ),
			"specCat": $L( "Newspapers & Magazines" )
		}, {
			"genCat": $L( "Fees & Charges" ),
			"specCat": $L( "ATM Fee" )
		}, {
			"genCat": $L( "Fees & Charges" ),
			"specCat": $L( "Bank Fee" )
		}, {
			"genCat": $L( "Fees & Charges" ),
			"specCat": $L( "Finance Charge" )
		}, {
			"genCat": $L( "Fees & Charges" ),
			"specCat": $L( "Late Fee" )
		}, {
			"genCat": $L( "Fees & Charges" ),
			"specCat": $L( "Service Fee" )
		}, {
			"genCat": $L( "Financial" ),
			"specCat": $L( "Financial Advisor" )
		}, {
			"genCat": $L( "Financial" ),
			"specCat": $L( "Life Insurance" )
		}, {
			"genCat": $L( "Food & Dining" ),
			"specCat": $L( "Alcohol & Bars" )
		}, {
			"genCat": $L( "Food & Dining" ),
			"specCat": $L( "Coffee Shops" )
		}, {
			"genCat": $L( "Food & Dining" ),
			"specCat": $L( "Fast Food" )
		}, {
			"genCat": $L( "Food & Dining" ),
			"specCat": $L( "Groceries" )
		}, {
			"genCat": $L( "Food & Dining" ),
			"specCat": $L( "Restaurants" )
		}, {
			"genCat": $L( "Gifts & Donations" ),
			"specCat": $L( "Charity" )
		}, {
			"genCat": $L( "Gifts & Donations" ),
			"specCat": $L( "Gift" )
		}, {
			"genCat": $L( "Health & Fitness" ),
			"specCat": $L( "Dentist" )
		}, {
			"genCat": $L( "Health & Fitness" ),
			"specCat": $L( "Doctor" )
		}, {
			"genCat": $L( "Health & Fitness" ),
			"specCat": $L( "Eyecare" )
		}, {
			"genCat": $L( "Health & Fitness" ),
			"specCat": $L( "Gym" )
		}, {
			"genCat": $L( "Health & Fitness" ),
			"specCat": $L( "Health Insurance" )
		}, {
			"genCat": $L( "Health & Fitness" ),
			"specCat": $L( "Pharmacy" )
		}, {
			"genCat": $L( "Health & Fitness" ),
			"specCat": $L( "Sports" )
		}, {
			"genCat": $L( "Home" ),
			"specCat": $L( "Furnishings" )
		}, {
			"genCat": $L( "Home" ),
			"specCat": $L( "Home Improvement" )
		}, {
			"genCat": $L( "Home" ),
			"specCat": $L( "Home Insurance" )
		}, {
			"genCat": $L( "Home" ),
			"specCat": $L( "Home Services" )
		}, {
			"genCat": $L( "Home" ),
			"specCat": $L( "Home Supplies" )
		}, {
			"genCat": $L( "Home" ),
			"specCat": $L( "Lawn & Garden" )
		}, {
			"genCat": $L( "Home" ),
			"specCat": $L( "Mortgage & Rent" )
		}, {
			"genCat": $L( "Income" ),
			"specCat": $L( "Bonus" )
		}, {
			"genCat": $L( "Income" ),
			"specCat": $L( "Paycheck" )
		}, {
			"genCat": $L( "Income" ),
			"specCat": $L( "Reimbursement" )
		}, {
			"genCat": $L( "Income" ),
			"specCat": $L( "Rental Income" )
		}, {
			"genCat": $L( "Income" ),
			"specCat": $L( "Returned Purchase" )
		}, {
			"genCat": $L( "Kids" ),
			"specCat": $L( "Allowance" )
		}, {
			"genCat": $L( "Kids" ),
			"specCat": $L( "Baby Supplies" )
		}, {
			"genCat": $L( "Kids" ),
			"specCat": $L( "Babysitter & Daycare" )
		}, {
			"genCat": $L( "Kids" ),
			"specCat": $L( "Child Support" )
		}, {
			"genCat": $L( "Kids" ),
			"specCat": $L( "Kids Activities" )
		}, {
			"genCat": $L( "Kids" ),
			"specCat": $L( "Toys" )
		}, {
			"genCat": $L( "Personal Care" ),
			"specCat": $L( "Hair" )
		}, {
			"genCat": $L( "Personal Care" ),
			"specCat": $L( "Laundry" )
		}, {
			"genCat": $L( "Personal Care" ),
			"specCat": $L( "Spa & Massage" )
		}, {
			"genCat": $L( "Pets" ),
			"specCat": $L( "Pet Food & Supplies" )
		}, {
			"genCat": $L( "Pets" ),
			"specCat": $L( "Pet Grooming" )
		}, {
			"genCat": $L( "Pets" ),
			"specCat": $L( "Veterinary" )
		}, {
			"genCat": $L( "Shopping" ),
			"specCat": $L( "Books" )
		}, {
			"genCat": $L( "Shopping" ),
			"specCat": $L( "Clothing" )
		}, {
			"genCat": $L( "Shopping" ),
			"specCat": $L( "Electronics & Software" )
		}, {
			"genCat": $L( "Shopping" ),
			"specCat": $L( "Hobbies" )
		}, {
			"genCat": $L( "Shopping" ),
			"specCat": $L( "Sporting Goods" )
		}, {
			"genCat": $L( "Taxes" ),
			"specCat": $L( "Federal Tax" )
		}, {
			"genCat": $L( "Taxes" ),
			"specCat": $L( "Local Tax" )
		}, {
			"genCat": $L( "Taxes" ),
			"specCat": $L( "Property Tax" )
		}, {
			"genCat": $L( "Taxes" ),
			"specCat": $L( "Sales Tax" )
		}, {
			"genCat": $L( "Taxes" ),
			"specCat": $L( "State Tax" )
		}, {
			"genCat": $L( "Transfer" ),
			"specCat": $L( "Credit Card Payment" )
		}, {
			"genCat": $L( "Travel" ),
			"specCat": $L( "Air Travel" )
		}, {
			"genCat": $L( "Travel" ),
			"specCat": $L( "Hotel" )
		}, {
			"genCat": $L( "Travel" ),
			"specCat": $L( "Rental Car & Taxi" )
		}, {
			"genCat": $L( "Travel" ),
			"specCat": $L( "Vacation" )
		}, {
			"genCat": $L( "Uncategorized" ),
			"specCat": $L( "Cash & ATM" )
		}, {
			"genCat": $L( "Uncategorized" ),
			"specCat": $L( "Check" )
		}, {
			"genCat": $L( "Uncategorized" ),
			"specCat": $L( "Other" )
		}
	];