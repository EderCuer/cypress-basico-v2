describe('Central de Atendimento ao Cliente TAT', function() {
    const nome = 'Eder'
    const sobrenome = 'Cuer'
    const email = 'seuemail@hotmail.com'
    const telefone = '14999999999'

    beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        cy.get('#firstName').type('Eder')
        cy.get('#lastName').type('Cuer')
        cy.get('#email').type('ederscuer@hotmail.com')
        cy.get('#open-text-area').type('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', { delay: 0 })
        cy.contains('.button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.get('#firstName').type('Eder')
        cy.get('#lastName').type('Cuer')
        cy.get('#email').type('ederscuer.com')
        cy.get('#open-text-area').type('Teste de email inválido')
        cy.contains('.button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('não permite que o campo telefone seja preenchido com texto', function() {
        cy.get('#phone').type('telefone').should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.get('#firstName').type('Eder')
        cy.get('#lastName').type('Cuer')
        cy.get('#email').type('ederscuer@hotmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste de telefone obrigatório')
        cy.contains('.button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('#firstName').type(nome).should('have.value', nome)
        cy.get('#lastName').type(sobrenome).should('have.value', sobrenome)
        cy.get('#phone').type(telefone).should('have.value', telefone)
        cy.get('#email').type(email).should('have.value', email)

        cy.get('#firstName').clear().should('have.value', '')
        cy.get('#lastName').clear().should('have.value', '')
        cy.get('#phone').clear().should('have.value', '')
        cy.get('#email').clear().should('have.value', '')       
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.contains('.button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit(nome, sobrenome, email)
    })

    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product').select(1).should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('[type="radio"]').check('feedback').should('be.checked')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('[type="radio"]').check('ajuda').should('be.checked')
        cy.get('[type="radio"]').check('elogio').should('be.checked')
        cy.get('[type="radio"]').check('feedback').should('be.checked')
    })

    it('marca cada tipo de atendimento 2', function() {
        cy.get('[type="radio"]').should('have.length', 3)
          .each(function($radio) {
            cy.wrap($radio).check().should('be.checked')
          })
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]').as('checkboxes').check()
        cy.get('@checkboxes')
          .each(function($checkbox) {
            cy.wrap($checkbox).check().should('be.checked')
          })
        cy.get('input[type="checkbox"]').last().uncheck().should('be.not.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('#file-upload').selectFile('cypress/fixtures/example.json')
          .then(input => {
            expect(input[0].files[0].name).to.equal('example.json')
          })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('#file-upload').selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
          .then(input => {
            expect(input[0].files[0].name).to.equal('example.json')
          })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('arquivo')
        cy.get('#file-upload').selectFile('@arquivo')
          .then(input => {
            expect(input[0].files[0].name).to.equal('example.json')
          })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('a[href="privacy.html"]').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicanco no link', function() {
        cy.get('a[href="privacy.html"]').invoke('removeAttr', 'target').click()

        cy.contains('Talking About Testing').should('be.visible')
    })

    it('testa a página da política de privavidade de forma independente', function() {
        cy.get('a[href="privacy.html"]').invoke('removeAttr', 'target').click()
        cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
    })
})
