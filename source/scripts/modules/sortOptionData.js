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

var budgetSortOptions = [
		{
			caption: $L( "Custom" ),
			value: 0,
			menuParent: "budgetSortOptions",
			query: "budgetOrder ASC, category COLLATE NOCASE ASC, category2 COLLATE NOCASE ASC, budgetId ASC"
		}, {
			caption: $L( "Alphabetical" ),
			value: 1,
			menuParent: "budgetSortOptions",
			query: "category COLLATE NOCASE ASC, category2 COLLATE NOCASE ASC, budgetId ASC"
		}, {
			caption: $L( "Budget Remaining (Asc)" ),
			value: 2,
			menuParent: "budgetSortOptions",
			query: "( spent / spending_limit ) ASC, category COLLATE NOCASE ASC, category2 COLLATE NOCASE ASC, budgetId ASC"
		}, {
			caption: $L( "Budget Remaining (Desc)" ),
			value: 3,
			menuParent: "budgetSortOptions",
			query: "( spent / spending_limit ) DESC, category COLLATE NOCASE ASC, category2 COLLATE NOCASE ASC, budgetId ASC"
		}
	];

var transactionSortOptions = [];

//In DB; default options here
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
			"qry": "IFNULL( NULLIF( checkNum, '' ), ( SELECT IFNULL( MAX( checkNum ), 0 ) FROM transactions LIMIT 1 ) ) ASC, itemId ASC",
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