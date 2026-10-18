TRANSACTIONTYPE=(
    ("expense", "Expense"),
    ("income", "Income"),
)




CURRENCY=(
    ("NGN", "Nigerian Naira"),
    ("USD", "US Dollar"),
    ("EUR", "Euro"),
)

CATEGORY_CHOICES = [
    ('INCOME', 'Income / Revenue'),
    ('COGS', 'Cost of Goods Sold'),
    ('UTILITIES', 'Rent & Utilities'),
    ('VEHICLE_TRAVEL', 'Vehicle & Travel'),
    ('SALARIES_PAYROLL', 'Salaries & Payroll'),
    ('CONTRACTORS', 'Contractors & Freelancers'),
    ('MARKETING', 'Marketing & Advertising'),
    ('SOFTWARE_SUBSCRIPTIONS', 'Software & Subscriptions'),
    ('OFFICE_SUPPLIES', 'Office Supplies & Equipment'),
    ('PROFESSIONAL_FEES', 'Professional Fees'),
    ('BANK_CHARGES', 'Bank Charges & Fees'),
    ('REPAIRS_MAINTENANCE', 'Repairs & Maintenance'),
    ('MEALS_ENTERTAINMENT', 'Meals & Entertainment'),
    ('OWNER_DRAW', 'Owner Draw / Personal Withdrawal'),
    ('OTHER', 'Other Expense'),
]


PAYMENT_STATUS=(
    ("paid", "Paid"),
    ("unpaid", "Unpaid"),
)

TRUE_FALSE=(
    ("true", "True"),
    ("false", "False"),
)


FILE_KIND=(
    ("receipt", "Receipt"),
    ("transfer", "Transfer"),
    ("statement", "Statement"),
)

FILE_STATUS=(
    ("pending", "Pending"),
    ("ready", "Ready"),
    ("failed", "Failed"),
)

