/* Copyright © 2011-2012, GlitchTech Science */

enyo.depends(
	"$lib/g11n",
	"$lib/layout",

	//To theme Onyx using Theme.less, swap commented lines and follow the steps described in Theme.less
	"$lib/onyx",
	//"$lib/onyx/source",
	"Theme.less",

	"$lib/SQLitePlugin.android.js",
	"$lib/database.js",
	"$lib/gdata.js",
	"$lib/utils.js",

	"$lib/aes.js",

	"$lib/gts-plugins/PrototypeExt",
	"$lib/gts-plugins/GAPI",
	"$lib/gts-plugins/LazyList",
	"$lib/gts-plugins/SelectorBar",
	"$lib/gts-plugins/ToggleBar",
	"$lib/gts-plugins/Divider",
	"$lib/gts-plugins/DividerDrawer",
	"$lib/gts-plugins/SelectedMenu",
	"$lib/gts-plugins/InlineNotification",
	"$lib/gts-plugins/IntegerPicker",
	"$lib/gts-plugins/IntegerPickerBar",
	"$lib/gts-plugins/DatePicker",
	"$lib/gts-plugins/TimePicker",
	"$lib/gts-plugins/DecimalInput",
	"$lib/gts-plugins/ConfirmDialog",
	"$lib/gts-plugins/ProgressDialog",
	"$lib/gts-plugins/AutoComplete",
	"$lib/gts-plugins/Item",
	"$lib/gts-plugins/EventMenu",

	"$lib/private",

	"scripts/"
);
