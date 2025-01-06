import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

interface Quote {
  quote: string,
  author: string,
}

@Component({
    selector: 'app-quote-dialog',
    imports: [
        MatDialogModule,
        MatButtonModule,
    ],
    templateUrl: './quote-dialog.component.html',
    styleUrl: './quote-dialog.component.scss'
})
export class QuoteDialogComponent {
  quotes: Quote[] = [
    { quote: "La educación es el arma más poderosa que puedes usar para cambiar el mundo.", author: "Nelson Mandela" },
    { quote: "Un buen maestro puede inspirar esperanza, encender la imaginación e inculcar el amor por el aprendizaje.", author: "Brad Henry" },
    { quote: "La enseñanza es el arte de asistir al descubrimiento.", author: "Mark Van Doren" },
    { quote: "El maestro deja una huella para la eternidad; nunca puede decir cuándo se detiene su influencia.", author: "Henry Adams" },
    { quote: "La educación no es llenar un cubo, sino encender un fuego.", author: "William Butler Yeats" },
    { quote: "El objeto de la educación es formar seres aptos para gobernarse a sí mismos.", author: "Herbert Spencer" },
    { quote: "La enseñanza es más que impartir conocimiento, es inspirar el cambio.", author: "William Arthur Ward" },
    { quote: "Un buen maestro es como una vela: se consume para iluminar el camino de los demás.", author: "Mustafa Kemal Atatürk" },
    { quote: "La educación es el movimiento de la oscuridad a la luz.", author: "Allan Bloom" },
    { quote: "El arte supremo del maestro es despertar el placer de la expresión creativa y el conocimiento.", author: "Albert Einstein" },
    { quote: "La educación es la llave para abrir la puerta dorada de la libertad.", author: "George Washington Carver" },
    { quote: "La enseñanza es la profesión que crea todas las demás profesiones.", author: "Desconocido" },
    { quote: "El maestro que intenta enseñar sin inspirar en el alumno el deseo de aprender está tratando de forjar un hierro frío.", author: "Horace Mann" },
    { quote: "La educación es el pasaporte hacia el futuro, porque el mañana pertenece a aquellos que se preparan para él hoy.", author: "Malcolm X" },
    { quote: "La educación es el alma de la sociedad, ya que pasa de una generación a otra.", author: "G.K. Chesterton" },
    { quote: "La educación es la base sobre la cual construimos nuestro futuro.", author: "Christine Gregoire" },
    { quote: "La enseñanza es la mayor de las artes, ya que el medio es la mente y el espíritu humanos.", author: "John Steinbeck" },
    { quote: "La educación es el encendido de una llama, no el llenado de un recipiente.", author: "Sócrates" },
    { quote: "El maestro que es realmente sabio no te invita a entrar en la casa de su sabiduría, sino que te guía hasta el umbral de tu mente.", author: "Khalil Gibran" },
    { quote: "La educación es el desarrollo en el hombre de toda la perfección de que su naturaleza es capaz.", author: "Immanuel Kant" },
    { quote: "La educación es el proceso de facilitar el aprendizaje, o la adquisición de conocimientos, habilidades, valores, creencias y hábitos.", author: "Desconocido" },
    { quote: "La educación es la mejor provisión para la vejez.", author: "Aristóteles" },
    { quote: "La educación es el poder para pensar claramente, el poder para actuar bien en el trabajo del mundo, y el poder para apreciar la vida.", author: "Brigham Young" },
    { quote: "La educación es el proceso de encender una llama, no de llenar un recipiente.", author: "Sócrates" },
    { quote: "La educación es la llave para desbloquear la puerta dorada de la libertad.", author: "George Washington Carver" },
    { quote: "La educación es la base sobre la cual construimos nuestro futuro.", author: "Christine Gregoire" },
    { quote: "La educación es el alma de la sociedad, ya que pasa de una generación a otra.", author: "G.K. Chesterton" },
    { quote: "La educación es el pasaporte hacia el futuro, porque el mañana pertenece a aquellos que se preparan para él hoy.", author: "Malcolm X" },
    { quote: "La educación es el movimiento de la oscuridad a la luz.", author: "Allan Bloom" },
    { quote: "La educación es el arma más poderosa que puedes usar para cambiar el mundo.", author: "Nelson Mandela" },
    { quote: "Un buen maestro puede inspirar esperanza, encender la imaginación e inculcar el amor por el aprendizaje.", author: "Brad Henry" },
    { quote: "La enseñanza es el arte de asistir al descubrimiento.", author: "Mark Van Doren" },
    { quote: "El maestro deja una huella para la eternidad; nunca puede decir cuándo se detiene su influencia.", author: "Henry Adams" },
    { quote: "La educación no es llenar un cubo, sino encender un fuego.", author: "William Butler Yeats" },
    { quote: "El objeto de la educación es formar seres aptos para gobernarse a sí mismos.", author: "Herbert Spencer" },
    { quote: "La enseñanza es más que impartir conocimiento, es inspirar el cambio.", author: "William Arthur Ward" },
    { quote: "Un buen maestro es como una vela: se consume para iluminar el camino de los demás.", author: "Mustafa Kemal Atatürk" },
    { quote: "La educación es el movimiento de la oscuridad a la luz.", author: "Allan Bloom" },
    { quote: "El arte supremo del maestro es despertar el placer de la expresión creativa y el conocimiento.", author: "Albert Einstein" },
    { quote: "La educación es la llave para abrir la puerta dorada de la libertad.", author: "George Washington Carver" },
    { quote: "La enseñanza es la profesión que crea todas las demás profesiones.", author: "Desconocido" },
    { quote: "El maestro que intenta enseñar sin inspirar en el alumno el deseo de aprender está tratando de forjar un hierro frío.", author: "Horace Mann" },
    { quote: "La educación es el pasaporte hacia el futuro, porque el mañana pertenece a aquellos que se preparan para él hoy.", author: "Malcolm X" },
    { quote: "La educación es el alma de la sociedad, ya que pasa de una generación a otra.", author: "G.K. Chesterton" },
    { quote: "La educación es la base sobre la cual construimos nuestro futuro.", author: "Christine Gregoire" },
    { quote: "La enseñanza es la mayor de las artes, ya que el medio es la mente y el espíritu humanos.", author: "John Steinbeck" },
    { quote: "La educación es el encendido de una llama, no el llenado de un recipiente.", author: "Sócrates" },
    { quote: "Un maestro afecta la eternidad; nunca puede decir dónde termina su influencia.", author: "Henry Brooks Adams" },
    { quote: "El secreto de la educación radica en respetar al estudiante.", author: "Ralph Waldo Emerson" },
    { quote: "Un maestro planta semillas de conocimiento que crecen para siempre.", author: "Desconocido" },
    { quote: "La enseñanza es una misión, no solo una profesión.", author: "Desconocido" },
    { quote: "La educación es nuestro pasaporte hacia el futuro.", author: "Lyndon B. Johnson" },
    { quote: "Ser maestro es enseñar a dudar de todo y a no dar nada por hecho.", author: "Ortega y Gasset" },
    { quote: "El maestro enseña más con su ejemplo que con sus palabras.", author: "Desconocido" },
    { quote: "El propósito de la educación es reemplazar una mente vacía con una abierta.", author: "Malcolm Forbes" },
    { quote: "El objetivo de la educación es preparar a los jóvenes para que se eduquen a sí mismos toda su vida.", author: "Robert Maynard Hutchins" },
    { quote: "El buen maestro hace que el mal estudiante se convierta en bueno y el buen estudiante en superior.", author: "Marva Collins" },
    { quote: "Los maestros son los que hacen posible el milagro del aprendizaje.", author: "Desconocido" },
    { quote: "Educar no es dar carrera para vivir, sino templar el alma para las dificultades de la vida.", author: "Pitágoras" },
    { quote: "Educar es sembrar en la mente de los niños la semilla del saber.", author: "Desconocido" },
    { quote: "El propósito de la educación no es llenar la mente de hechos, sino encender una chispa en la mente.", author: "Desconocido" },
    { quote: "El que enseña es un guía, no un comandante.", author: "Desconocido" },
    { quote: "Ser maestro es despertar el hambre de conocimiento.", author: "Desconocido" },
    { quote: "La enseñanza que deja huella no es la que se hace de cabeza a cabeza, sino de corazón a corazón.", author: "Howard G. Hendricks" },
    { quote: "El maestro que enseña a aprender es el mejor maestro.", author: "Desconocido" },
    { quote: "Un verdadero maestro es aquel que te muestra el camino, pero deja que tú lo recorras.", author: "Desconocido" },
    { quote: "El maestro es aquel que enseña para la vida, no solo para los exámenes.", author: "Desconocido" },
    { quote: "Los maestros pueden cambiar vidas con la mezcla correcta de tiza y desafíos.", author: "Joyce Meyer" },
    { quote: "Ser maestro es tocar vidas para siempre.", author: "Desconocido" },
    { quote: "Un maestro no es aquel que te da respuestas, sino quien te provoca preguntas.", author: "Desconocido" },
    { quote: "La mejor enseñanza es la que nos hace pensar por nosotros mismos.", author: "Desconocido" },
    { quote: "Ser maestro es ser un facilitador del aprendizaje y un motivador de sueños.", author: "Desconocido" },
    { quote: "La educación es la mejor herencia que se puede dejar a un hijo.", author: "Desconocido" },
    { quote: "El maestro inspira más con su ser que con su saber.", author: "Desconocido" },
    { quote: "El verdadero maestro defiende a sus alumnos contra su propia influencia personal.", author: "Amos Bronson Alcott" },
    { quote: "La educación es una aventura que transforma tanto al que enseña como al que aprende.", author: "Desconocido" },
    { quote: "La enseñanza es la profesión que ilumina el camino hacia un mundo mejor.", author: "Desconocido" },
    { quote: "Los maestros no pueden abrir la puerta del conocimiento, pero pueden proporcionar las llaves.", author: "Desconocido" },
    { quote: "El maestro no debe enseñar lo que sabe, sino lo que desea aprender.", author: "Desconocido" },
    { quote: "Un maestro no solo enseña, sino que construye el puente hacia el futuro.", author: "Desconocido" },
    { quote: "El mejor maestro no te enseña, te inspira.", author: "Desconocido" },
    { quote: "La educación es la mejor herramienta para construir una vida mejor.", author: "Desconocido" },
    { quote: "El maestro es el arquitecto de las mentes jóvenes.", author: "Desconocido" },
    { quote: "Ser maestro es abrir ventanas al mundo del conocimiento.", author: "Desconocido" },
    { quote: "El maestro no es quien da respuestas, sino quien enseña a buscarlas.", author: "Desconocido" },
    { quote: "La enseñanza efectiva es más un dar de sí mismo que un repartir conocimiento.", author: "Desconocido" },
    { quote: "Un maestro es alguien que nunca deja de aprender.", author: "Desconocido" },
    { quote: "El maestro guía con paciencia hacia el descubrimiento de la verdad.", author: "Desconocido" },
    { quote: "El maestro siempre sigue siendo un estudiante en su corazón.", author: "Desconocido" },
    { quote: "Un buen maestro enseña con su vida más que con sus palabras.", author: "Desconocido" },
    { quote: "El maestro crea el ambiente donde florecen las ideas.", author: "Desconocido" },
    { quote: "La enseñanza es un arte que moldea mentes y corazones.", author: "Desconocido" },
    { quote: "Educar no es enseñar a vivir, es enseñar a aprender a vivir.", author: "Desconocido" },
    { quote: "El maestro inspira confianza para explorar lo desconocido.", author: "Desconocido" },
    { quote: "Ser maestro es dejar una huella invisible pero indeleble en la vida de los demás.", author: "Desconocido" },
    { quote: "La educación no es para llenar mentes, es para encender la chispa del ingenio.", author: "Desconocido" },
    { quote: "El maestro deja de ser maestro cuando deja de aprender.", author: "Desconocido" }
  ];

  selectedQuote: Quote;

  constructor() {
    this.selectedQuote = this.randomQuote();
  }

  selectQuote() {
    this.selectedQuote = this.randomQuote();
  }

  randomQuote(): Quote {
    const randomIndex = Math.floor(Math.random() * (this.quotes.length - 1));
    return this.quotes[randomIndex];
  }
}
