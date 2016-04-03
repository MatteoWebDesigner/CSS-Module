# CSS-Module
System to create isolated bundle.

## Build bundle
- > gulp --bundle=site
- > gulp --bundle=spa

###Note:
You need to build both "site" and "spa".
Because jade is processing both templates and it requires the complete json to compile the template.

##List Features:
- postcss
- cssnext
- css dependencies system
- css modules
- doiuse
- stylelint