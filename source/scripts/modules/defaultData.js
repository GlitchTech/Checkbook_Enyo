var dbArgs = {
		database: "ext:checkbook-database",
		version: "1",
		name: "Checkbook DB",
		estimatedSize: ( 5 * 1024 * 1024 ),

		debug: false//Only debug when in Beta versions
	};

/** Default Data **/
var defaultAccountCategories = [
		{
			"name": "Checking",
			"catOrder": 1,
			"icon": "checkbook_1.png",
			"color": "green"
		}, {
			"name": "Savings",
			"catOrder": 2,
			"icon": "safe_1.png",
			"color": "yellow"
		}, {
			"name": "Credit Card",
			"catOrder": 3,
			"icon": "credit_card_3.png",
			"color": "red"
		}, {
			"name": "Other",
			"catOrder": 4,
			"icon": "coins_3.png",
			"color": "black"
		}
	];

//Remove and use file picker in modify account categories?
var appIcons = [
		 /*{//Reserved for recurring events icon: "assets/calendar.png", value: "calendar.png", components: [ { kind: "enyo.Image", src: "assets/calendar.png" } ] },*/
		{ icon: "assets/cash_1.png", value: "cash_1.png", components: [ { kind: "enyo.Image", src: "assets/cash_1.png" } ] },
		{ icon: "assets/cash_2.png", value: "cash_2.png", components: [ { kind: "enyo.Image", src: "assets/cash_2.png" } ] },
		{ icon: "assets/cash_3.png", value: "cash_3.png", components: [ { kind: "enyo.Image", src: "assets/cash_3.png" } ] },
		{ icon: "assets/cash_4.png", value: "cash_4.png", components: [ { kind: "enyo.Image", src: "assets/cash_4.png" } ] },
		{ icon: "assets/cash_5.png", value: "cash_5.png", components: [ { kind: "enyo.Image", src: "assets/cash_5.png" } ] },
		{ icon: "assets/checkbook_1.png", value: "checkbook_1.png", components: [ { kind: "enyo.Image", src: "assets/checkbook_1.png" } ] },
		{ icon: "assets/checkbook_2.png", value: "checkbook_2.png", components: [ { kind: "enyo.Image", src: "assets/checkbook_2.png" } ] },
		{ icon: "assets/coins_1.png", value: "coins_1.png", components: [ { kind: "enyo.Image", src: "assets/coins_1.png" } ] },
		{ icon: "assets/coins_2.png", value: "coins_2.png", components: [ { kind: "enyo.Image", src: "assets/coins_2.png" } ] },
		{ icon: "assets/coins_3.png", value: "coins_3.png", components: [ { kind: "enyo.Image", src: "assets/coins_3.png" } ] },
		{ icon: "assets/coins_4.png", value: "coins_4.png", components: [ { kind: "enyo.Image", src: "assets/coins_4.png" } ] },
		{ icon: "assets/credit_card_1.png", value: "credit_card_1.png", components: [ { kind: "enyo.Image", src: "assets/credit_card_1.png" } ] },
		{ icon: "assets/credit_card_2.png", value: "credit_card_2.png", components: [ { kind: "enyo.Image", src: "assets/credit_card_2.png" } ] },
		{ icon: "assets/credit_card_3.png", value: "credit_card_3.png", components: [ { kind: "enyo.Image", src: "assets/credit_card_3.png" } ] },
		{ icon: "assets/dollar_sign_1.png", value: "dollar_sign_1.png", components: [ { kind: "enyo.Image", src: "assets/dollar_sign_1.png" } ] },
		{ icon: "assets/dollar_sign_2.png", value: "dollar_sign_2.png", components: [ { kind: "enyo.Image", src: "assets/dollar_sign_2.png" } ] },
		{ icon: "assets/dollar_sign_3.png", value: "dollar_sign_3.png", components: [ { kind: "enyo.Image", src: "assets/dollar_sign_3.png" } ] },
		{ icon: "assets/echeck.png", value: "echeck.png", components: [ { kind: "enyo.Image", src: "assets/echeck.png" } ] },
		/* { //Reserved for recurring transfers icon: "assets/future_transfer_1.png", value: "future_transfer_1.png", components: [ { kind: "enyo.Image", src: "assets/future_transfer_1.png" } ] },*/
		{ icon: "assets/icon_1.png", value: "icon_1.png", components: [ { kind: "enyo.Image", src: "assets/icon_1.png" } ] },
		{ icon: "assets/icon_2.png", value: "icon_2.png", components: [ { kind: "enyo.Image", src: "assets/icon_2.png" } ] },
		{ icon: "assets/icon_3.png", value: "icon_3.png", components: [ { kind: "enyo.Image", src: "assets/icon_3.png" } ] },
		{ icon: "assets/icon_4.png", value: "icon_4.png", components: [ { kind: "enyo.Image", src: "assets/icon_4.png" } ] },
		{ icon: "assets/jewel_1.png", value: "jewel_1.png", components: [ { kind: "enyo.Image", src: "assets/jewel_1.png" } ] },
		{ icon: "assets/jewel_2.png", value: "jewel_2.png", components: [ { kind: "enyo.Image", src: "assets/jewel_2.png" } ] },
		{ icon: "assets/money_bag_1.png", value: "money_bag_1.png", components: [ { kind: "enyo.Image", src: "assets/money_bag_1.png" } ] },
		{ icon: "assets/money_bag_2.png", value: "money_bag_2.png", components: [ { kind: "enyo.Image", src: "assets/money_bag_2.png" } ] },
		{ icon: "assets/money_bag_3.png", value: "money_bag_3.png", components: [ { kind: "enyo.Image", src: "assets/money_bag_3.png" } ] },
		{ icon: "assets/money_bag_4.png", value: "money_bag_4.png", components: [ { kind: "enyo.Image", src: "assets/money_bag_4.png" } ] },
		 /*{ //Reserved for locked accounts icon: "assets/padlock_1.png", value: "padlock_1.png", components: [ { kind: "enyo.Image", src: "assets/padlock_1.png" } ] },*/
		{ icon: "assets/padlock_2.png", value: "padlock_2.png", components: [ { kind: "enyo.Image", src: "assets/padlock_2.png" } ] },
		{ icon: "assets/safe_1.png", value: "safe_1.png", components: [ { kind: "enyo.Image", src: "assets/safe_1.png" } ] },
		{ icon: "assets/safe_2.png", value: "safe_2.png", components: [ { kind: "enyo.Image", src: "assets/safe_2.png" } ] },
		{ icon: "assets/transfer_1.png", value: "transfer_1.png", components: [ { kind: "enyo.Image", src: "assets/transfer_1.png" } ] },
		{ icon: "assets/transfer_2.png", value: "transfer_2.png", components: [ { kind: "enyo.Image", src: "assets/transfer_2.png" } ] },
		 /*{ //Reserved for transfers icon: "assets/transfer_3.png", value: "transfer_3.png", components: [ { kind: "enyo.Image", src: "assets/transfer_3.png" } ] },*/
		{ icon: "assets/transfer_4.png", value: "transfer_4.png", components: [ { kind: "enyo.Image", src: "assets/transfer_4.png" } ] }
	];

var appColors = [
		{ content: "Black", classes: "custom-background black legend", name: "black" },
		{ content: "Blue", classes: "custom-background blue legend", name: "blue" },
		{ content: "Green", classes: "custom-background green legend", name: "green" },
		{ content: "Orange", classes: "custom-background orange legend", name: "orange" },
		{ content: "Pink", classes: "custom-background pink legend", name: "pink" },
		{ content: "Purple", classes: "custom-background purple legend", name: "purple" },
		{ content: "Red", classes: "custom-background red legend", name: "red" },
		{ content: "Teal", classes: "custom-background teal legend", name: "teal" },
		{ content: "Yellow", classes: "custom-background yellow legend", name: "yellow" }
	];

var defaultExpenseCategories = [
		{
			"genCat": "Auto & Transport",
			"specCat": "Auto Insurance"
		}, {
			"genCat": "Auto & Transport",
			"specCat": "Auto Payment"
		}, {
			"genCat": "Auto & Transport",
			"specCat": "Gas & Fuel"
		}, {
			"genCat": "Auto & Transport",
			"specCat": "Parking"
		}, {
			"genCat": "Auto & Transport",
			"specCat": "Public Transportation"
		}, {
			"genCat": "Auto & Transport",
			"specCat": "Service & Parts"
		}, {
			"genCat": "Auto & Transport",
			"specCat": "Car Wash"
		}, {
			"genCat": "Bills & Utilities",
			"specCat": "Home Phone"
		}, {
			"genCat": "Bills & Utilities",
			"specCat": "Internet"
		}, {
			"genCat": "Bills & Utilities",
			"specCat": "Mobile Phone"
		}, {
			"genCat": "Bills & Utilities",
			"specCat": "Television"
		}, {
			"genCat": "Bills & Utilities",
			"specCat": "Utilities"
		}, {
			"genCat": "Business Services",
			"specCat": "Advertising"
		}, {
			"genCat": "Business Services",
			"specCat": "Legal"
		}, {
			"genCat": "Business Services",
			"specCat": "Office Supplies"
		}, {
			"genCat": "Business Services",
			"specCat": "Printing"
		}, {
			"genCat": "Business Services",
			"specCat": "Shipping"
		}, {
			"genCat": "Education",
			"specCat": "Books & Supplies"
		}, {
			"genCat": "Education",
			"specCat": "Student Loan"
		}, {
			"genCat": "Education",
			"specCat": "Tuition"
		}, {
			"genCat": "Entertainment",
			"specCat": "Amusement"
		}, {
			"genCat": "Entertainment",
			"specCat": "Arts"
		}, {
			"genCat": "Entertainment",
			"specCat": "Movies & DVDs"
		}, {
			"genCat": "Entertainment",
			"specCat": "Music"
		}, {
			"genCat": "Entertainment",
			"specCat": "Newspapers & Magazines"
		}, {
			"genCat": "Fees & Charges",
			"specCat": "ATM Fee"
		}, {
			"genCat": "Fees & Charges",
			"specCat": "Bank Fee"
		}, {
			"genCat": "Fees & Charges",
			"specCat": "Finance Charge"
		}, {
			"genCat": "Fees & Charges",
			"specCat": "Late Fee"
		}, {
			"genCat": "Fees & Charges",
			"specCat": "Service Fee"
		}, {
			"genCat": "Financial",
			"specCat": "Financial Advisor"
		}, {
			"genCat": "Financial",
			"specCat": "Life Insurance"
		}, {
			"genCat": "Food & Dining",
			"specCat": "Alcohol & Bars"
		}, {
			"genCat": "Food & Dining",
			"specCat": "Coffee Shops"
		}, {
			"genCat": "Food & Dining",
			"specCat": "Fast Food"
		}, {
			"genCat": "Food & Dining",
			"specCat": "Groceries"
		}, {
			"genCat": "Food & Dining",
			"specCat": "Restaurants"
		}, {
			"genCat": "Gifts & Donations",
			"specCat": "Charity"
		}, {
			"genCat": "Gifts & Donations",
			"specCat": "Gift"
		}, {
			"genCat": "Health & Fitness",
			"specCat": "Dentist"
		}, {
			"genCat": "Health & Fitness",
			"specCat": "Doctor"
		}, {
			"genCat": "Health & Fitness",
			"specCat": "Eyecare"
		}, {
			"genCat": "Health & Fitness",
			"specCat": "Gym"
		}, {
			"genCat": "Health & Fitness",
			"specCat": "Health Insurance"
		}, {
			"genCat": "Health & Fitness",
			"specCat": "Pharmacy"
		}, {
			"genCat": "Health & Fitness",
			"specCat": "Sports"
		}, {
			"genCat": "Home",
			"specCat": "Furnishings"
		}, {
			"genCat": "Home",
			"specCat": "Home Improvement"
		}, {
			"genCat": "Home",
			"specCat": "Home Insurance"
		}, {
			"genCat": "Home",
			"specCat": "Home Services"
		}, {
			"genCat": "Home",
			"specCat": "Home Supplies"
		}, {
			"genCat": "Home",
			"specCat": "Lawn & Garden"
		}, {
			"genCat": "Home",
			"specCat": "Mortgage & Rent"
		}, {
			"genCat": "Income",
			"specCat": "Bonus"
		}, {
			"genCat": "Income",
			"specCat": "Paycheck"
		}, {
			"genCat": "Income",
			"specCat": "Reimbursement"
		}, {
			"genCat": "Income",
			"specCat": "Rental Income"
		}, {
			"genCat": "Income",
			"specCat": "Returned Purchase"
		}, {
			"genCat": "Kids",
			"specCat": "Allowance"
		}, {
			"genCat": "Kids",
			"specCat": "Baby Supplies"
		}, {
			"genCat": "Kids",
			"specCat": "Babysitter & Daycare"
		}, {
			"genCat": "Kids",
			"specCat": "Child Support"
		}, {
			"genCat": "Kids",
			"specCat": "Kids Activities"
		}, {
			"genCat": "Kids",
			"specCat": "Toys"
		}, {
			"genCat": "Personal Care",
			"specCat": "Hair"
		}, {
			"genCat": "Personal Care",
			"specCat": "Laundry"
		}, {
			"genCat": "Personal Care",
			"specCat": "Spa & Massage"
		}, {
			"genCat": "Pets",
			"specCat": "Pet Food & Supplies"
		}, {
			"genCat": "Pets",
			"specCat": "Pet Grooming"
		}, {
			"genCat": "Pets",
			"specCat": "Veterinary"
		}, {
			"genCat": "Shopping",
			"specCat": "Books"
		}, {
			"genCat": "Shopping",
			"specCat": "Clothing"
		}, {
			"genCat": "Shopping",
			"specCat": "Electronics & Software"
		}, {
			"genCat": "Shopping",
			"specCat": "Hobbies"
		}, {
			"genCat": "Shopping",
			"specCat": "Sporting Goods"
		}, {
			"genCat": "Taxes",
			"specCat": "Federal Tax"
		}, {
			"genCat": "Taxes",
			"specCat": "Local Tax"
		}, {
			"genCat": "Taxes",
			"specCat": "Property Tax"
		}, {
			"genCat": "Taxes",
			"specCat": "Sales Tax"
		}, {
			"genCat": "Taxes",
			"specCat": "State Tax"
		}, {
			"genCat": "Transfer",
			"specCat": "Credit Card Payment"
		}, {
			"genCat": "Travel",
			"specCat": "Air Travel"
		}, {
			"genCat": "Travel",
			"specCat": "Hotel"
		}, {
			"genCat": "Travel",
			"specCat": "Rental Car & Taxi"
		}, {
			"genCat": "Travel",
			"specCat": "Vacation"
		}, {
			"genCat": "Uncategorized",
			"specCat": "Cash & ATM"
		}, {
			"genCat": "Uncategorized",
			"specCat": "Check"
		}, {
			"genCat": "Uncategorized",
			"specCat": "Other"
		}
	];
