# Paylocity QA Assessment Automation

Automated test suite for the Paylocity Benefits application using Playwright with API and UI tests.

## Project Structure

```
paylocity-qa-assessment-automation/
├── src/
│   ├── api/
│   │   ├── apiClient.ts          # HTTP client with Basic Auth
│   │   ├── employeesService.ts   # Employee API wrapper
│   │   ├── responseValidator.ts  # API response validation
│   │   └── fixtures.ts           # API test fixtures (api/employeesService)
│   ├── ui/
│   │   ├── pages/                # Page Object Models
│   │   └── components/           # UI Components
│   └── utils/
│       ├── testData.ts           # Test data generation
│       ├── testHelpers.ts        # Helper functions
│       ├── fixtures.ts           # UI test fixtures (dashboard/modal)
│       └── env.ts                # Environment config
├── tests/
│   ├── api/
│   │   ├── employees.create.spec.ts   # POST /api/employees tests
│   │   ├── employees.get.spec.ts      # GET /api/employees tests
│   │   ├── employees.getById.spec.ts  # GET /api/employees/{id} tests
│   │   ├── employees.update.spec.ts   # PUT /api/employees tests
│   │   └── employees.delete.spec.ts   # DELETE /api/employees tests
│   └── ui/
│       └── employees.ui.spec.ts       # UI tests
└── .github/
    └── workflows/
        └── playwrighttests.yml   # CI/CD workflow
```

## Prerequisites

- **Node.js** v20 or higher
- **npm** v10 or higher
- Valid test credentials (TEST_USERNAME, TEST_PASSWORD)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd paylocity-qa-assessment-automation
```

2. Install dependencies:

```bash
npm ci
```

3. Install Chromium browser:

```bash
npm run browsers:install
```

4. Create `.env` file with credentials:

```env
TEST_USERNAME=your_username
TEST_PASSWORD=your_password
BASE_URL=https://your-app-url
```

## Running Tests

### All Tests

```bash
npm test
```

### API Tests Only

```bash
npm run test:api
```

### UI Tests Only

```bash
npm run test:ui
```

### Specific Test File

```bash
npx playwright test tests/api/employees.create.spec.ts
```

### View Test Report

```bash
npm run test:report
```

## Available npm Scripts

| Script                     | Purpose                  |
| -------------------------- | ------------------------ |
| `npm test`                 | Run all tests (API + UI) |
| `npm run test:api`         | Run API tests only       |
| `npm run test:ui`          | Run UI tests only        |
| `npm run test:report`      | Open HTML test report    |
| `npm run browsers:install` | Install Chromium browser |

## API Test Organization

Tests are organized by HTTP method:

- **Create** (`employees.create.spec.ts`) - POST /api/employees
  - Valid data creation
  - Field validation
  - Error handling

- **Read All** (`employees.get.spec.ts`) - GET /api/employees
  - Listing all employees
  - Response structure validation

- **Read by ID** (`employees.getById.spec.ts`) - GET /api/employees/{id}
  - Fetching individual employee
  - Invalid ID handling

- **Update** (`employees.update.spec.ts`) - PUT /api/employees
  - Valid updates
  - Field validation

- **Delete** (`employees.delete.spec.ts`) - DELETE /api/employees/{id}
  - Deletion
  - Verification of deletion

## UI Test Features

- Page Object Model pattern for maintainability
- Authentication state management
- Employee creation via UI
- Form validation testing
- Modal interaction handling

## CI/CD - GitHub Actions

Tests run on manual trigger (workflow_dispatch) with default branch `main`.

### Workflow Features

- **Parallel execution**: API and UI tests run simultaneously
- **Artifact upload**: Test reports saved for 2 days
- **Environment secrets**: TEST_USERNAME and TEST_PASSWORD from GitHub Secrets
- **Browser**: Chromium only (optimized for speed)

### To run tests manually:

1. Go to **Actions** → **Playwright Tests**
2. Click **Run workflow**
3. Select a branch. defaults to main
4. View results in the workflow run

## Test Data

- Test data is generated using `createEmployee()` helper
- Unique identifiers use timestamps to prevent conflicts
- Employee payload example:

```typescript
const employee = createEmployee({
  firstName: `John-${Date.now()}`,
  lastName: `Doe-${Date.now()}`,
  dependants: 2,
});
```

## Fixtures

Playwright fixtures provide reusable test setup and teardown:

### API Fixtures (`src/api/fixtures.ts`)

- **`api`** - `ApiClient` instance with automatic Basic Auth headers
- **`employeesService`** - `EmployeesService` wrapper for API endpoints

Usage in tests:

```typescript
test('example', async ({ api, employeesService }) => {
  const response = await employeesService.createEmployee(payload);
  expect(response.status()).toBe(200);
});
```

### UI Fixtures (`src/utils/fixtures.ts`)

- **`dashboard`** - `DashboardPage` instance for dashboard interactions
- **`modal`** - `AddEmployeeModal` instance for modal interactions
- **`page`** - Built-in Playwright page object (available in all tests)

Usage in tests:

```typescript
test('example', async ({ page, dashboard, modal }) => {
  await dashboard.openAddEmployee();
  await modal.fillEmployee(data);
});
```

## Authentication

- **API**: Basic Auth headers added via `ApiClient` (automatic in fixtures)
- **UI**: Storage state saved in `authstate.json` for session persistence
- Credentials loaded from `.env` file (TEST_USERNAME, TEST_PASSWORD)

## Debugging

### View test trace

```bash
npx playwright show-trace test-results/trace.zip
```

### Run single test in headed mode

```bash
npx playwright test tests/api/employees.create.spec.ts --headed
```

### Debug mode

```bash
npx playwright test --debug
```

## Known Issues

Some tests are marked with `.fixme()` indicating known API behavior issues:

- Unknown properties not being rejected in POST/PUT
- Optional fields not being persisted
- Invalid ID handling inconsistencies

These are documented in the test comments and tracked separately in https://github.com/DariaBor/paylocity-qa-assessment-bug-challenge.
