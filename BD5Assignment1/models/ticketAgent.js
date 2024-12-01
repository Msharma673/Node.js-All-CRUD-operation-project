module.exports = (sequelize, DataTypes) => {
  return sequelize.define("TicketAgent", {
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Tickets",
        key: "id",
      },
      primaryKey: true,
    },
    agentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Agents",
        key: "id",
      },
      primaryKey: true,
    },
  });
};
