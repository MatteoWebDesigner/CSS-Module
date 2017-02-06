# Inline style
## web
page.html
```html
<span
	style="
		width: 100%;
		height: 100px;
		color: #00FF00;
		font-family: monospace;
	"
	>{{hello}}</span>
```

## android
page.xml
```xml
<TextView
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:textColor="#00FF00"
    android:typeface="monospace"
    android:text="@string/hello" />
```

# Create style definition
## web
code-font.css
```css
.CodeFont {
	width: 100%;
	height: 100px;
	color: #00FF00;
	font-family: monospace;
}
```

page.html
```html
<span 
	class="CodeFont"
	>{{hello}}</span>
```

## android
code-font.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="CodeFont">
        <item name="android:layout_width">fill_parent</item>
        <item name="android:layout_height">wrap_content</item>
        <item name="android:textColor">#00FF00</item>
        <item name="android:typeface">monospace</item>
    </style>
</resources>
```

page.xml
```xml
<TextView
    style="@style/CodeFont"
    android:text="@string/hello" />
```	
	
# Inheritance
## web
code-font.css
```css
.CodeFont {
	composes: TextAppearance from "./style/text-appearance.css";
	font-family: monospace;
}

.CodeFontBig {
	composes: CodeFont;
	font-size: 30px;	
}
```

page.html
```html
<span 
	class="{{style.CodeFontBig}}"
	>{{hello}}</span>
```

## android
code-font.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="CodeFont" parent="@android:style/TextAppearance">
        <item name="android:typeface">monospace</item>
    </style>
	
	<style name="CodeFont.Big">
        <item name="android:textSize">30sp</item>
    </style>
</resources>
```

page.xml
```xml
<TextView
    style="@style/CodeFont.Big"
    android:text="@string/hello" />
```	

## Resources:
- https://github.com/css-modules/css-modules
- https://developer.android.com/guide/topics/ui/themes.html