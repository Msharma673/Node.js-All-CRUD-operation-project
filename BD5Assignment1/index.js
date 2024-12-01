const express = require("express");
const db = require("./models");

const app = express();
app.use(express.json());

// Helper Functions
async function getTicketCustomers(ticketId) {
  const ticketCustomers = await db.TicketCustomer.findAll({
    where: { ticketId },
  });
  return Promise.all(
    ticketCustomers.map(
      async (tc) => await db.Customer.findByPk(tc.customerId),
    ),
  );
}

async function getTicketAgents(ticketId) {
  const ticketAgents = await db.TicketAgent.findAll({ where: { ticketId } });
  return Promise.all(
    ticketAgents.map(async (ta) => await db.Agent.findByPk(ta.agentId)),
  );
}

async function getTicketDetails(ticketData) {
  const customers = await getTicketCustomers(ticketData.id);
  const agents = await getTicketAgents(ticketData.id);
  return { ...ticketData.dataValues, customers, agents };
}

// Seed Database
app.get("/seed_db", async (req, res) => {
  await db.sequelize.sync({ force: true });

  const customers = await db.Customer.bulkCreate([
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" },
  ]);

  const agents = await db.Agent.bulkCreate([
    { name: "Charlie", email: "charlie@example.com" },
    { name: "Dave", email: "dave@example.com" },
  ]);

  const tickets = await db.Ticket.bulkCreate([
    {
      title: "Login Issue",
      description: "Cannot login",
      status: "open",
      priority: 1,
    },
    {
      title: "Payment Failure",
      description: "Payment not processed",
      status: "closed",
      priority: 2,
    },
    {
      title: "Bug Report",
      description: "Found a bug",
      status: "open",
      priority: 3,
    },
  ]);

  await db.TicketCustomer.bulkCreate([
    { ticketId: tickets[0].id, customerId: customers[0].id },
    { ticketId: tickets[1].id, customerId: customers[1].id },
    { ticketId: tickets[2].id, customerId: customers[0].id },
  ]);

  await db.TicketAgent.bulkCreate([
    { ticketId: tickets[0].id, agentId: agents[0].id },
    { ticketId: tickets[1].id, agentId: agents[1].id },
    { ticketId: tickets[2].id, agentId: agents[0].id },
  ]);

  res.json({ message: "Database seeded successfully!" });
});

// Endpoints
app.get("/tickets", async (req, res) => {
  const tickets = await db.Ticket.findAll();
  const detailedTickets = await Promise.all(tickets.map(getTicketDetails));
  res.json({ tickets: detailedTickets });
});

app.get("/tickets/details/:id", async (req, res) => {
  const ticket = await db.Ticket.findByPk(req.params.id);
  const detailedTicket = await getTicketDetails(ticket);
  res.json({ ticket: detailedTicket });
});

app.get("/tickets/status/:status", async (req, res) => {
  const tickets = await db.Ticket.findAll({
    where: { status: req.params.status },
  });
  const detailedTickets = await Promise.all(tickets.map(getTicketDetails));
  res.json({ tickets: detailedTickets });
});

app.get("/tickets/sort-by-priority", async (req, res) => {
  const tickets = await db.Ticket.findAll({ order: [["priority", "ASC"]] });
  const detailedTickets = await Promise.all(tickets.map(getTicketDetails));
  res.json({ tickets: detailedTickets });
});

app.post("/tickets/new", async (req, res) => {
  const ticket = await db.Ticket.create(req.body);
  res.json({ ticket });
});

app.post("/tickets/update/:id", async (req, res) => {
  const ticket = await db.Ticket.findByPk(req.params.id);
  await ticket.update(req.body);
  res.json({ ticket });
});

app.post("/tickets/delete", async (req, res) => {
  await db.Ticket.destroy({ where: { id: req.body.id } });
  res.json({ message: `Ticket with ID ${req.body.id} deleted successfully.` });
});

// Start Server
app.listen(3000, () =>
  console.log("Server is running on http://localhost:3000"),
);
