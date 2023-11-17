describe("image upload", () => {
  it("accepts example JPEG file", () => {
    cy.visit("/");

    cy.get("main").contains("Drag your photo here");
    cy.get(".image-uploader").should("have.class", "upload-stage-select-file");

    cy.get("input[type=file]").selectFile("cypress/fixtures/example.jpeg", {
      force: true,
    });
    cy.get("div.photo")
      .should("have.css", "background-image")
      .and("include", "blob");
    cy.get(".image-uploader").should("have.class", "upload-stage-input-name");

    cy.get("input[type=text]").type("My picture");
    cy.get("button[type=submit]").click();

    cy.get(".image-uploader").should("have.class", "upload-stage-uploading");

    cy.get("div[role=status]").contains("Image uploaded successfully");
    cy.get(".image-uploader").should("have.class", "upload-stage-success");
  });

  it("returns to previous screen when user presses cancel", () => {
    cy.visit("/");

    cy.get(".image-uploader").should("have.class", "upload-stage-select-file");
    cy.get("input[type=file]").selectFile("cypress/fixtures/example.jpeg", {
      force: true,
    });
    cy.get("input[type=text]").type("My picture");
    cy.get("button.secondary").click();

    cy.get(".image-uploader").should("have.class", "upload-stage-select-file");
  });

  it("fails to validate when name is too short", () => {
    cy.visit("/");

    cy.get(".image-uploader").should("have.class", "upload-stage-select-file");
    cy.get("input[type=file]").selectFile("cypress/fixtures/example.jpeg", {
      force: true,
    });
    cy.get("input[type=text]").type("My");
    cy.get("button[type=submit]").click();

    cy.get("p.error-msg").contains(
      "The name must be at least 3 characters long",
    );
  });

  it("fails for unsupported image formats", () => {
    cy.visit("/");

    cy.get("input[type=file]").selectFile("cypress/fixtures/example.webp", {
      force: true,
    });
    cy.get("div[role=status]").contains("Invalid file format");
  });
});
