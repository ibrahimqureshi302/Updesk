TIMESHEETS_QUERY = """
query GetTimesheets($from: String!, $to: String!) {
  timesheets(filter: { dateFrom: $from, dateTo: $to }) {
    id
    date
    hours
    memo
    amount { amount currencyCode }
    contract { id title }
  }
}
"""

TRANSACTIONS_QUERY = """
query {
  transactions {
    id
    date
    type
    description
    amount { amount currencyCode }
    contract { id title }
  }
}
"""
