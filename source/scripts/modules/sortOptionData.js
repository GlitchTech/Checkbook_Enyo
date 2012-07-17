var accountSortOptions = [
		{
			content: "Custom Category",
			value: 0,
			menuParent: "accountSortOptions",
			query: "acctCatOrder, acctCategory COLLATE NOCASE, sect_order, acctName COLLATE NOCASE"
		}, {
			content: "Custom Account",
			value: 1,
			menuParent: "accountSortOptions",
			query: "sect_order, acctName COLLATE NOCASE, acctCatOrder, acctCategory COLLATE NOCASE"
		}, {
			content: "Alphabetical Name",
			value: 2,
			menuParent: "accountSortOptions",
			query: "acctName COLLATE NOCASE, acctCategory COLLATE NOCASE"
		}, {
			content: "Alphabetical Category",
			value: 3,
			menuParent: "accountSortOptions",
			query: "acctCategory COLLATE NOCASE, acctName COLLATE NOCASE"
		}
	];

var budgetSortOptions = [
		{
			content: "Custom",
			value: 0,
			menuParent: "budgetSortOptions",
			query: "budgetOrder ASC, category COLLATE NOCASE ASC, category2 COLLATE NOCASE ASC, budgetId ASC"
		}, {
			content: "Alphabetical",
			value: 1,
			menuParent: "budgetSortOptions",
			query: "category COLLATE NOCASE ASC, category2 COLLATE NOCASE ASC, budgetId ASC"
		}, {
			content: "Budget Remaining (Asc)",
			value: 2,
			menuParent: "budgetSortOptions",
			query: "( spent / spending_limit ) ASC, category COLLATE NOCASE ASC, category2 COLLATE NOCASE ASC, budgetId ASC"
		}, {
			content: "Budget Remaining (Desc)",
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
			//Will work with lists new ability to go bottom-up
			"sortGroup": "Date",
			"groupOrder": 0,
			"label": "Oldest to Newest, Show Newest",
			"desc": "Sorts transactions from oldest to newest. Displays the newest transactions.",
			"qry": "date ASC, itemId ASC",
			"sortId": 0
		}, {*/
			"sortGroup": "Date",
			"groupOrder": 0,
			"label": "Newest to Oldest, Show Newest",
			"desc": "Sorts transactions from newest to oldest. Displays the newest transactions.",
			"qry": "date DESC, itemId DESC",
			"sortId": 1
		}, {
			"sortGroup": "Date",
			"groupOrder": 0,
			"label": "Oldest to Newest, Show Oldest",
			"desc": "Sorts transactions from oldest to newest. Displays the oldest transactions.",
			"qry": "date ASC, itemId ASC",
			"sortId": 8
		},

		{
			"sortGroup": "Description",
			"groupOrder": 1,
			"label": "A-Z",
			"desc": "Sorts transactions from A to Z. Displays the newest transactions.",
			"qry": "desc COLLATE NOCASE ASC, itemId ASC",
			"sortId": 2
		}, {
			"sortGroup": "Description",
			"groupOrder": 1,
			"label": "Z-A",
			"desc": "Sorts transactions from A to Z. Displays the newest transactions.",
			"qry": "desc COLLATE NOCASE DESC, itemId ASC",
			"sortId": 3
		},

		{
			"sortGroup": "Amount",
			"groupOrder": 2,
			"label": "Ascending",
			"desc": "Sorts transactions by amount, ascending. Displays the greatest expense.",
			"qry": "amount ASC, itemId ASC",
			"sortId": 4
		}, {
			"sortGroup": "Amount",
			"groupOrder": 2,
			"label": "Descending",
			"desc": "Sorts transactions by amount, descending. Displays the greatest income.",
			"qry": "amount DESC, itemId ASC",
			"sortId": 5
		},

		{
			"sortGroup": "Status",
			"groupOrder": 3,
			"label": "Cleared first",
			"desc": "Sorts transactions by cleared status with Cleared transactions first. Transactions are then sorted by date from newest to oldest.",
			"qry": "cleared DESC, date ASC, itemId ASC",
			"sortId": 6
		}, {
			"sortGroup": "Status",
			"groupOrder": 3,
			"label": "Pending first",
			"desc": "Sorts transactions by cleared status with Uncleared transactions first. Transactions are then sorted by date from newest to oldest.",
			"qry": "cleared ASC, date DESC, itemId ASC",
			"sortId": 7
		},

		{
			"sortGroup": "Check Number",
			"groupOrder": 4,
			"label": "Ascending Numbers",
			"desc": "Sorts transactions by check number. Displays the lowest numbered check first. Transactions without check numbers are sorted last.",
			"qry": "IFNULL( NULLIF( checkNum, '' ), ( SELECT IFNULL( MAX( checkNum ), 0 ) FROM transactions LIMIT 1 ) ) ASC, itemId ASC",
			"sortId": 9
		}, {
			"sortGroup": "Check Number",
			"groupOrder": 4,
			"label": "Descending Numbers",
			"desc": "Sorts transactions by check number. Displays the highest numbered check first. Transactions without check numbers are sorted last.",
			"qry": "checkNum DESC, itemId ASC",
			"sortId": 10
		}
	];
