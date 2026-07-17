QUERY = """
query GetMessages($contractId: ID!) {
  messages(contractId: $contractId) {
    id
    body
    createdAt
    sender { id name }
  }
}
"""
