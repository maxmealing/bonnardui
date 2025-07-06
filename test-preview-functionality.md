# Preview Controls Functionality Tests

## Expected Behavior

### Initial State
- **Channel Mode**: Shows "Generate" button only
- **Direct Message (No Recipients)**: Shows error state asking to configure recipients
- **Direct Message (With Recipients)**: Shows generation controls only (no navigation)

### Generation Flow
1. User sees "Generate previews for [input] of [total]" with number input defaulting to total recipients
2. User can adjust number input (1 to total recipients)
3. User clicks "Generate" button
4. Loading state shows with spinner
5. After generation completes, navigation controls appear in right column

### Navigation Flow (After Generation)
1. Right column shows "Browse: [Name] [X of Y]" where Y = number generated
2. Left/right arrows are fixed on far right
3. Navigation is limited to generated previews only
4. Counter shows current position within generated previews

### Input Validation
- Number input accepts values 1 to total recipients
- Values outside range are auto-corrected
- Generate button disabled for invalid values

## Test Scenarios

### Scenario 1: Channel Mode
- **Setup**: destinationType = "channel", selectedChannel = "general"
- **Expected**: Simple generate button, no recipient selection
- **Action**: Click generate
- **Expected Result**: Preview generated for channel

### Scenario 2: No Recipients Selected
- **Setup**: destinationType = "direct-message", selectedRecipients = []
- **Expected**: Error state with "Configure Recipients" button
- **Action**: Click configure button
- **Expected Result**: Scroll to top (receiver section)

### Scenario 3: Single Recipient
- **Setup**: destinationType = "direct-message", selectedRecipients = ["john-smith"]
- **Expected**: "Generate previews for 1 of 1" with input field
- **Action**: Click generate
- **Expected Result**: Navigation shows "Browse: John Smith 1 of 1" with disabled arrows

### Scenario 4: Multiple Recipients - Generate All
- **Setup**: destinationType = "direct-message", selectedRecipients = ["john-smith", "sarah-johnson", "mike-chen"]
- **Expected**: "Generate previews for 3 of 3" with editable input
- **Action**: Click generate
- **Expected Result**: Navigation allows browsing "1 of 3", "2 of 3", "3 of 3"

### Scenario 5: Multiple Recipients - Generate Subset
- **Setup**: destinationType = "direct-message", selectedRecipients = ["john-smith", "sarah-johnson", "mike-chen"]
- **Action**: Change input to 2, click generate
- **Expected Result**: Navigation shows "1 of 2", "2 of 2" (only first 2 recipients)

### Scenario 6: Input Validation
- **Setup**: 5 recipients available
- **Test Cases**:
  - Input 0 → Auto-corrects to 1
  - Input 10 → Auto-corrects to 5
  - Input negative → Auto-corrects to 1
  - Input empty → Auto-corrects to 1

### Scenario 7: Arrow Navigation
- **Setup**: Generated previews for 3 recipients
- **Expected Behavior**:
  - Start at index 0: Left arrow disabled, right arrow enabled
  - Middle index 1: Both arrows enabled
  - End index 2: Right arrow disabled, left arrow enabled
  - Arrows stay in fixed position regardless of name length

### Scenario 8: State Management
- **Expected**:
  - hasGenerated starts false, becomes true after generation
  - numberOfRecipients updates when selectedRecipients changes
  - currentRecipientIndex resets when new generation happens
  - Navigation only appears after successful generation

## Issues to Fix

Based on expected behavior, I need to verify and fix:
1. Input validation logic
2. Navigation bounds checking
3. State management between generations
4. Arrow positioning and behavior
5. Counter accuracy
6. Loading state management