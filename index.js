import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "boomboom69",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


async function getItems(req, res) {
  const itemsList = await db.query("SELECT * FROM items");
  return itemsList.rows;
}

app.get("/", async (req, res) => {
  const items = await getItems(req, res);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query(`INSERT INTO items (title) VALUES ('${item}')`);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const editedData = req.body.updatedItemTitle;
  try {
    await db.query(`
      UPDATE items 
      SET title = '${editedData}'
      WHERE id = ${id}
      `);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query(`DELETE FROM items WHERE id = ${id}`);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

