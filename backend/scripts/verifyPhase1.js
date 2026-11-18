require("dotenv").config();

const mongoose = require("mongoose");
const assert = require("node:assert/strict");

const connectDB = require("../config/db");

const User = require("../models/User");
const Transaction = require("../models/Transaction");

const { rupeesToPaise, paiseToRupees } = require("../utils/money");

async function expectValidationError(document, description) {
    try {
        await document.validate();
        throw new Error(`${description}: Validation unexpectedly passed`);
    } catch (error) {
        if (!(error instanceof mongoose.Error.ValidationError)) {
            throw error;
        }

        console.log(`PASS: ${description}`);
    }
}

async function verifyPhase1() {
    try {
        // 1. Connect to MongoDB
        await connectDB();

        assert.equal(
            mongoose.connection.name,
            "expensewise",
            "Connected to an unexpected database"
        );

        console.log("PASS: Connected to expensewise database");

        // 2. Ensure database indexes are created
        await Promise.all([
            User.init(),
            Transaction.init()
        ]);

        console.log("PASS: Database indexes initialized");

        // 3. Test money conversion
        assert.equal(rupeesToPaise("100"), 10000);
        assert.equal(rupeesToPaise("150.50"), 15050);
        assert.equal(rupeesToPaise("999.99"), 99999);

        assert.equal(paiseToRupees(15050), 150.5);

        console.log("PASS: Money conversion");

        // 4. Test invalid money inputs
        for (const amount of ["0", "-100", "100.123", "abc"]) {
            assert.throws(() => rupeesToPaise(amount));
        }

        console.log("PASS: Invalid money values rejected");

        // 5. Test valid User model
        const validUser = new User({
            name: "Test User",
            email: "test@example.com",
            passwordHash: "test-hash"
        });

        await validUser.validate();

        console.log("PASS: Valid User model");

        // 6. Test valid Transaction model
        const validTransaction = new Transaction({
            userId: new mongoose.Types.ObjectId(),
            title: "Grocery Shopping",
            amountPaise: 15000,
            type: "expense",
            category: "Groceries",
            transactionDate: new Date()
        });

        await validTransaction.validate();

        console.log("PASS: Valid Transaction model");

        // 7. Test invalid transaction values
        const baseTransaction = {
            userId: new mongoose.Types.ObjectId(),
            title: "Test Transaction",
            amountPaise: 10000,
            type: "expense",
            category: "Food",
            transactionDate: new Date()
        };

        await expectValidationError(
            new Transaction({
                ...baseTransaction,
                amountPaise: 0
            }),
            "Zero transaction amount rejected"
        );

        await expectValidationError(
            new Transaction({
                ...baseTransaction,
                type: "transfer"
            }),
            "Invalid transaction type rejected"
        );

        await expectValidationError(
            new Transaction({
                ...baseTransaction,
                category: "Salary"
            }),
            "Incorrect category rejected"
        );

        // 8. Test unique email index in MongoDB
        const testEmail = `phase1-test-${Date.now()}@example.test`;

        try {
            await User.create({
                name: "Index Test",
                email: testEmail,
                passwordHash: "test-hash"
            });

            let duplicateRejected = false;

            try {
                await User.create({
                    name: "Duplicate Test",
                    email: testEmail,
                    passwordHash: "test-hash"
                });
            } catch (error) {
                if (error.code === 11000) {
                    duplicateRejected = true;
                } else {
                    throw error;
                }
            }

            assert.equal(
                duplicateRejected,
                true,
                "Duplicate email was not rejected"
            );

            console.log("PASS: Duplicate email rejected by unique index");

        } finally {
            await User.deleteMany({ email: testEmail });
        }

        console.log("\nALL PHASE 1 CHECKS PASSED!");

    } finally {
        await mongoose.disconnect();
    }
}

verifyPhase1().catch((error) => {
    console.error("PHASE 1 VERIFICATION FAILED:", error.message);
    process.exitCode = 1;
});