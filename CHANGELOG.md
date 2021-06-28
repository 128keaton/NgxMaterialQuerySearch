# 0.3.9
- Fixed:
  - Issues with scroll listener on autocomplete removal
  - Issues with emitting query with empty fields
  
# 0.3.8
- Improved:
  - Layout with between date fields has been improved considerably
  
- New:
  - Infinite scroll on autocomplete options
  
# 0.3.7
- Fixed:
  - Inactive rules are now no longer included with the query
  
# 0.3.5/0.3.6
- Fixed:
  - `BETWEEN` operator in filters not applying to Datetime field
  
# 0.3.4
- Fixed:
  - Button heights corrected
  
# 0.3.3
- New:
  - Adds support for saving/loading/managing filters (provided by the containing application)
    - The demo has a very limited example of this
  - Better layout and animations
  
- Fixed:
  - Equals limits to one value for provided values
  - Between limits to two values for provided values
  
# 0.3.2
- Fixed:
  - All search options not displaying in results
  
# 0.3.1
- Fixed:
  - Field/operator suffixes being crammed in the select
  
- New:
  - Configuration options for showing/hiding field/operator suffixes
  - Configuration option for limiting initial results in the dropdown
  
# 0.3.0
- Improved:
  - Search performance on a list of large values.
  
- New:
  - Switched to `ngx-mat-select-search` to handle selects (field name and operator).
  - All operators have a sign now.
  - Field Name and Operator selects render properly.
  
# 0.2.8
- Improved:
  - Fixes some spacing issues with between date fields

# 0.2.8
- Fixed:
  - Reverts color changes on search dropdown
  
# 0.2.7
- Fixed:
  - Colors on search dropdown
  
# 0.2.6
- New:
  - Added `sortFields` boolean option to config.
  
# 0.2.5
- New:
  - Fields are now sorted alphabetically by their name
  
# 0.2.4
- Fixed:
  - Minimum width on fields not being set
  
# 0.2.3
- New:
  - Between date fields now show start/end date fields
  
- Improved:
  - Some fields broken out into separate components (WIP)

# 0.2.2

- Fixed:
  - Values staying when field or operator changes
  - $in/$notin not returning an array
  
- New:
  - Better performance (switched change detection strategy)
