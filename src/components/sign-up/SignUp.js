import "./styles.scss"
import React from "react"
import { toast } from "react-toastify";
import { Profile } from '../../api/'
import { values, size } from 'lodash'
import { isEmailValid } from '../../utils/validations'
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap'

/**
 * En: Component for registering new accounts
 * Es: Componente para registrar nuevas cuentas
 */
export default class SignUp extends React.Component {
  /**
   * En: Hide the modal sale
   * Es: Ocultar la venta modal
   * @var hidden function
   */
  hidden = undefined;
  constructor(props) {
    super(props)
    this.hidden = props.hidden
    this.state = {
      send: false,
      form: { name: "José Alexander", lastName: "Guerrero Carrizo", email: "q@gmail.com", password: "123456", repeatPassword: "123456" }
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  /**
   * En: Update the status in the form to send
   * Es: Actualizar el estado en el formulario a enviar
   * @param {*} event 
   */
  onChange(event) {
    this.setState({
      form: { ...this.state.form, [event.target.name]: event.target.value }
    })
  }
  /**
   * En: Send registration data to create an account
   * Es: Enviar datos de registro para crear una cuenta
   * @param {*} event 
   */
  onSubmit(event) {
    event.preventDefault()
    let validCount = 0;
    values(this.state.form).some(value => {
      value && validCount++;
      return null;
    });
    if (validCount !== size(this.state.form)) {
      toast.warning("Es necesario completar todos los campos");
      return false;
    }
    if (!isEmailValid(this.state.form.email)) {
      toast.warning("Correo electrónico incorrecto");
      return false;
    }
    if (this.state.form.password !== this.state.form.repeatPassword) {
      toast.warning("Clave de seguridad deben de ser iguales");
      return false;
    }
    if (size(this.state.form.password) < 6) {
      toast.warning("Clave de seguridad debe tener al menos 6 caracteres");
      return false;
    }
    let state = false
    this.setState({ send: true })
    Profile.Store(this.state.form).then(response => {
      const { status } = response
      if (status === 201) {
        state = true
        toast.success("Cuenta de usuario creada existosamente")
      }
    }).catch(error => {
      const { code, message, description } = error.response.data
      switch(code) {
        case "004":
          toast.warning(`Existe una cuenta de usuario con el correo electrónico. ${ this.state.form.email }`);
        break;
        default:
          toast.warning(`Ocurrio un error en el servidor. (${ code }) ${ message }: ${ description }`);
        break;
      }
    }).finally(() => {
      this.setState({ send: false })
      if (state) {
        this.hidden()
      }
    })
  }
  /**
   * En: Build component Sign Up
   * Es: Construir componente Sign Up
   */
  render() {
    return (
      <>
        <h5>Crear cuenta</h5>
        <Form onSubmit={ this.onSubmit } onChange={ this.onChange } autoComplete="off">
          <Form.Group>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Nombres"
                  defaultValue={ this.state.form.name } />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Apellidos"
                  defaultValue={ this.state.form.lastName } />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  defaultValue={ this.state.form.email } />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Clave de seguridad"
                  defaultValue={ this.state.form.password } />
              </Col>
              <Col>
                <Form.Control
                  type="password"
                  name="repeatPassword"
                  placeholder="Repetir clave de seguridad"
                  defaultValue={ this.state.form.repeatPassword } />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
          <Button
            block
            type="submit"
            variant="primary"
            disabled={ this.state.send }
          >
            { this.state.send ? <Spinner animation="border" /> : "Regístrarse" }
          </Button>
          </Form.Group>
        </Form>
      </>
    )
  }
}
