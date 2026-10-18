# Utility Files – Prompts

**Target folder:** `utils/`

## Common Requirements

For every prompt below:

- Create the file in the existing `utils/` folder using TypeScript.
- Use only the existing dependencies already present in `package.json` (`@faker-js/faker`, `mysql2`, `dotenv`, `csv-parse`, `xlsx`).
- Do not add any other methods, classes, interfaces, types, constants, dependencies, validation, logging, or functionality beyond what the prompt specifies.
- Do not change the class names, method names, parameter names, return structures, values, or behavior specified below.
- Use clean, beginner-friendly TypeScript suitable for a Playwright automation framework.
- Do not create any additional files.
- Return only the complete code for the requested file.

---

# 1. Create `helper.ts`

## Prompt

Create or update a file named `helper.ts` in the existing folder `utils`.

Create and export a class named `Helper` with exactly these static methods:


### 1.1 `getLoginDetails()`

Use the existing `dotenv` dependencies.

Import:

- `dotenv` from `dotenv`

Call:

`dotenv.config()`

Create and export exactly one asynchronous function:

`getLogin(): string`

The function must:

1. Read the following connection details from environment variables:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`

Return exactly this object structure:

- `username: "adminbarts"`
- `password: "P@ssw0rd!004"`

## Expected Result

A `utils/helper.ts` file exporting the `Helper` class with the two specified static methods, used for login and select client.

---

# 2. Create `dataGenerator.ts`

## Prompt

Create or update a file named `dataGenerator.ts` in the existing folder `utils`.

Use the existing `@faker-js/faker` dependency. Import Faker exactly from:

`@faker-js/faker`

Create and export a class named `RandomDataUtil`.

### 2.1 Person

Implement exactly these static methods:

- `getCallerFirstName(): string`
- `getCallerLastName(): string`

Use the corresponding Faker person.


### 2.2 API Payload Generators


Use the existing `dotenv` dependencies.

Import:

- `dotenv` from `dotenv`

Call:

`dotenv.config()`

Create and export exactly one asynchronous function:

`getAPIDetails(): string`

The function must:

1. Read the following API connection details from environment variables:
   - `USERNAME`
   - `PASSWORD`
   - `CLIENT_KEY`
   - `INTAKE_KEY`

Return exactly this object structure from env data:
  - `username: "USERNAME"`
  - `password: "PASSWORD"`
  - `clientkey: "CLIENT_KEY"`
  - `intakekey: "INTAKE_KEY"`


Implement exactly these static methods:

- `authLogin()`
- `createIntake()`

Required return structures:

- `authLogin()` must return:
  - `username` generated from `getAPIDetails().username`
  - `password` generated using `getAPIDetails().password`

- `createIntake()` must return:
  - `clientKey` generated from `getAPIDetails().clientkey`
  - `intakeKey` generated from `getAPIDetails().intakekey`

Use the existing methods within `RandomDataUtil` wherever applicable instead of duplicating Faker logic.

## Expected Result

A `utils/dataGenerator.ts` file exporting the `RandomDataUtil` class that generates random person.

---

# 3. Create `DataReader.ts`

## Prompt

Create a new file named `DataReader.ts` in the existing folder `utils`.

Use the existing dependencies:

- `fs`
- `csv-parse`
- `xlsx`

Create and export a class named `DataProvider`.

Implement exactly these three static methods:

### 3.1 `readJson(filePath: string)`

- Read the JSON file using `fs.readFileSync(filePath, 'utf8')`.
- Parse the file contents using `JSON.parse()`.
- Return the parsed data.

### 3.2 `readCsv(filePath: string)`

- Read the CSV file using `fs.readFileSync(filePath)`.
- Parse the CSV using `parse()` from `csv-parse/sync`.
- Use these parsing options:
  - `columns: true`
  - `skip_empty_lines: true`
- Return the parsed data.

### 3.3 `readExcel(filePath: string)`

- Read the Excel workbook using `XLSX.readFile(filePath)`.
- Select the first worksheet using `workbook.SheetNames[0]`.
- Get that worksheet from `workbook.Sheets[sheetName]`.
- Convert the worksheet to JSON data using `XLSX.utils.sheet_to_json(worksheet, { header: 1 })`.
- Return the resulting data.

Do not add support for additional file formats.

Do not add sheet-name parameters.

Do not add additional methods, classes, interfaces, types, constants, validation, logging, error handling, or functionality.

## Expected Result

A `utils/DataReader.ts` file exporting the `DataProvider` class with three static methods for reading JSON, CSV, and Excel test data files.

---

## Final Implementation Quality Criteria

The generated utility files must:

- Exist in the `utils/` folder with the exact file names specified.
- Export the exact class and function names specified (`Helper`, `RandomDataUtil`, `DataProvider`).
- Match the specified method signatures and return structures exactly.
- Reuse existing dependencies only; do not install or invent new ones.
- Use internal `RandomDataUtil` methods instead of duplicating Faker logic where applicable.
- Be simple enough for beginners to understand.
- Be free of extra functionality, logging, or error handling not requested.
