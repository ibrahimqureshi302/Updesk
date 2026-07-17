QUERY = """
query {
  contracts {
    id
    title
    status
    contractType
    startDate
    endDate
    hourlyRate { amount currencyCode }
    fixedPrice  { amount currencyCode }
    client { id name }
    milestones {
      id
      title
      status
      dueDate
      amount { amount currencyCode }
    }
  }
}
"""
