# 7.2.3 Angular: Fundamentos

[atrás](../README.md)


## **1.Bootstrap**


El **Bootstrap** (o arranque) de una aplicación en **Angular 20 LTS** es el proceso inicial mediante el cual el framework carga los componentes, configura las dependencias globales y renderiza la aplicación en el navegador.

En Angular 20, el estándar consolidado es el **enfoque "Standalone"**, que elimina la necesidad de los antiguos `NgModule`. 

### 1.1. El Punto de Entrada: `main.ts`

En Angular 20, el archivo `main.ts` es el cerebro del arranque. A diferencia de versiones antiguas (donde se usaba `platformBrowserDynamic().bootstrapModule(AppModule)`), ahora se utiliza la función **`bootstrapApplication`**.

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

### 1.2. Configuración de la Aplicación: `app.config.ts`

Angular 20 separa la lógica de arranque de la configuración. El objeto `ApplicationConfig` es donde se inyectan todos los servicios globales (providers) que antes iban en el `AppModule`.

*   **`provideRouter`**: Configura las rutas.
*   **`provideHttpClient`**: Habilita las peticiones HTTP.
*   **`provideAnimations`**: Activa el sistema de animaciones.
*   **Zoneless (Opcional pero recomendado)**: En Angular 20, la configuración para aplicaciones sin `zone.js` (usando solo Signals) es mucho más estable.

```typescript
// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Optimización de detección de cambios (o incluso zoneless)
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    // Otros providers como provideHttpClient() o provideAnimations()
  ]
};
```

### 1.3. Componente Raíz: `AppComponent`

En el Bootstrap, indicas cuál es el componente que se cargará primero. En Angular 20, este componente **debe ser `standalone: true`** (que es el valor predeterminado al generar componentes ahora).


### Resumen de diferencias

En el siguiente cuadro se ven algunas diferencias entre versiones de Angular en cuanto a la carga de la aplicación. 


| Característica | Angular Antiguo (pre-v17) | Angular 20 LTS |
| :--- | :--- | :--- |
| **Método** | `bootstrapModule(AppModule)` | `bootstrapApplication(AppComponent)` |
| **Organización** | Basada en `NgModule` | Basada en `ApplicationConfig` |
| **Componentes** | Declarados en módulos | Standalone por defecto |
| **Reactividad** | Zone.js (implícito) | Signals / Zoneless (opcional y optimizado) |

El bootstrap en Angular 20 es el acto de decirle al framework: *"Usa este componente como base, aplica estas configuraciones globales y hazlo de la manera más ligera posible sin usar módulos intermedios"*.



## **2. Componentes**

En este apartado se verá uno de los fundamentos de Angular: `el componente`. Aprenderemos a crearlos, a mostrar datos en la vista y a responder a las interacciones del usuario.

Trabajaremos con la versión de Angular 20 LTS, destacando las prácticas con  componentes independientes (Standalone Components), que son el estándar actual.

En Angular, una aplicación es un árbol de componentes. Con las versiones más recientes, estos componentes son ahora independientes (*standalone*), lo que significa que cada pieza de la interfaz de usuario es más autocontenida y modular que nunca, encapsulando su propia lógica, apariencia y dependencias.

### **¿Qué es un componente? TS + HTML + CSS**

Un componente en Angular sigue estando formado por tres partes fundamentales que trabajan juntas:

*   **TypeScript (TS):** Es el cerebro del componente. Aquí se define la lógica, las propiedades (los datos que manejará) y los métodos (las acciones que podrá realizar).
*   **HTML (La Plantilla):** Es el esqueleto del componente. Define la estructura visual, lo que el usuario verá en el navegador.
*   **CSS (Los Estilos):** Es la piel del componente. Se encarga de dar estilo y apariencia a la plantilla HTML.

Para que una simple clase de TypeScript se convierta en un componente de Angular, necesitamos "decorarla". Aquí entra en juego el decorador `@Component`.

### **El Decorador `@Component`**

Un decorador es una función especial que se identifica con el símbolo `@` y que añade metadatos a una clase. El decorador `@Component` le indica a Angular cómo debe tratar a esa clase, y en Angular 20, le especifica que es un componente independiente.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-mi-primer-componente',
  standalone: true, 
  imports: [CommonModule], // Aquí se declaran las dependencias del componente
  templateUrl: './mi-primer-componente.html',
  styleUrls: ['./mi-primer-componente.css']
})
export class MiPrimerComponenteComponent {
  // Aquí va la lógica del componente
}
```

#### **Propiedades clave del decorador `@Component` en Angular 20:**

*   **`selector`**: Es el nombre que le damos a la etiqueta HTML personalizada para este componente. Para usarlo, escribiríamos `<app-mi-primer-componente></app-mi-primer-componente>`.
*   **`standalone: true`**: Esta propiedad convierte al componente en una pieza independiente. Esto elimina la necesidad de declararlo en un `NgModule`. Los nuevos componentes generados con el CLI de Angular ya incluyen esta opción por defecto.
*   **`imports`**: Al ser independientes, los componentes deben declarar sus propias dependencias. En este array se importan otros componentes, directivas, pipes o módulos que se vayan a utilizar en la plantilla.
*   **`templateUrl`**: Especifica la ruta al fichero HTML que contiene la plantilla del componente.
*   **`styleUrls`**: Es un array de rutas a los ficheros CSS que darán estilo al componente.

### **Plantilla en línea (inline) vs. Fichero Externo**

El concepto no ha cambiado, pero su aplicación es ahora dentro de un componente independiente. Para plantillas o estilos muy pequeños, puedes definirlos directamente en el fichero de TypeScript.

#### **Plantilla en línea**
En lugar de `templateUrl`, se puede usar la propiedad `template` para escribir el HTML directamente en el decorador.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-saludo',
  standalone: true,
  template: '<h1>¡Hola, Mundo desde un componente Standalone!</h1>'
})
export class SaludoComponent {}
```

#### **Estilos en línea**
De la misma forma, para los estilos, podemos usar la propiedad `styles` en lugar de `styleUrls` para escribir CSS en el propio fichero del componente.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-saludo-con-estilo',
  standalone: true,
  template: '<h1>¡Hola, Mundo con Estilo!</h1>',
  styles: [`
    h1 {
      color: blue;
      font-family: sans-serif;
    }
  `]
})
export class SaludoConEstiloComponent {}
```

Esta aproximación con componentes independientes (`standalone`) simplifica la arquitectura de las aplicaciones en Angular, haciendo que el desarrollo sea más directo y la gestión de dependencias más clara y localizada. clara y localizada. [cite: 1]

## **3. Plantillas y Binding Básico: Conectando Lógica y Vista**

El "binding" o enlace de datos es el mecanismo que conecta la lógica de nuestro componente (TypeScript) con su vista (HTML).

**Interpolación `{{ }}`**

La interpolación es la forma más sencilla de mostrar datos del componente en la plantilla. Se utiliza la sintaxis de dobles llaves `{{ }}` para mostrar el valor de una propiedad.

*   **En el TypeScript (`.ts`):**
    ```typescript
    export class PerfilUsuarioComponent {
      nombreUsuario: string = 'Luffy';
      edad: number = 19;
    }
    ```

*   **En el HTML (`.html`):**
    ```html
    <h2>Perfil de Usuario</h2>
    <p>Nombre: {{ nombreUsuario }}</p>
    <p>Edad: {{ edad }} años</p>
    ```
    Angular sustituirá `{{ nombreUsuario }}` por "Luffy" y `{{ edad }}` por "19".

**Property Binding `[prop]`**

Sirve para enlazar el valor de una propiedad del componente a una propiedad de un elemento HTML. La sintaxis utiliza corchetes `[]`.

*   **En el TypeScript (`.ts`):**
    ```typescript
    export class ImagenComponent {
      urlImagen: string = 'https://.../imagen.png';
      descripcion: string = 'Logo de Angular';
    }
    ```

*   **En el HTML (`.html`):**
    ```html
    <img [src]="urlImagen" [alt]="descripcion">
    ```
    Aquí, el valor de la propiedad `src` de la etiqueta `<img>` se tomará de la variable `urlImagen` del componente.

**Event Binding `(evento)`**

Nos permite escuchar eventos del DOM (como clics, pulsaciones de teclas, etc.) y ejecutar un método de nuestro componente cuando ocurren. La sintaxis utiliza paréntesis `()`.

*   **En el TypeScript (`.ts`):**
    ```typescript
    export class ContadorComponent {
      contador: number = 0;

      incrementar() {
        this.contador++;
      }
    }
    ```

*   **En el HTML (`.html`):**
    ```html
    <p>Contador: {{ contador }}</p>
    <button (click)="incrementar()">Incrementar</button>
    ```
    Cada vez que se haga clic en el botón, se ejecutará el método `incrementar()` del componente.

---

## **4. Control de Flujo Integrado: La Evolución de las Directivas**

Con la llegada de las versiones más recientes de Angular, las directivas estructurales como `*ngIf` y `*ngFor` han sido reemplazadas por una sintaxis de control de flujo más moderna, legible y potente. Este nuevo enfoque elimina el prefijo de asterisco `*` y se asemeja más a la sintaxis de JavaScript, haciendo las plantillas más intuitivas.

### **`@if`: La Lógica Condicional**

El bloque `@if` sustituye a la directiva `*ngIf` y permite renderizar elementos del DOM basándose en una condición booleana. Su sintaxis es mucho más clara, especialmente al manejar casos alternativos con `@else`.

*   **En el TypeScript (`.ts`):**
    ```typescript
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-saludo-condicional',
      standalone: true,
      templateUrl: './saludo-condicional.component.html'
    })
    export class SaludoCondicionalComponent {
      estaLogueado: boolean = true;
    }
    ```

*   **En el HTML (`.html`):**
    ```html
    @if (estaLogueado) {
      <h2>Bienvenido, usuario.</h2>
    } @else {
      <p>Por favor, inicia sesión.</p>
    }
    ```
    Como se puede ver, esta sintaxis es más limpia y elimina la necesidad de `ng-template` para las condiciones "else". Solo se mostrará uno de los dos bloques dependiendo del valor de `estaLogueado`.

### **`@for`: Iterando sobre Colecciones**

El bloque `@for` es el sucesor de `*ngFor` y se utiliza para recorrer un array y generar un bloque de HTML para cada uno de sus elementos. Una de sus principales mejoras es la inclusión obligatoria de la cláusula `track`, que optimiza el rendimiento al identificar de forma única cada elemento de la lista.

*   **En el TypeScript (`.ts`):**
    ```typescript
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-lista-frutas',
      standalone: true,
      templateUrl: './lista-frutas.html'
    })
    export class ListaFrutasComponent {
      frutas: string[] = ['Manzana', 'Naranja', 'Plátano'];
    }
    ```

*   **En el HTML (`.html`):**
    ```html
    <ul>
      @for (fruta of frutas; track fruta) {
        <li>{{ fruta }}</li>
      } @empty {
        <li>No hay frutas en la lista.</li>
      }
    </ul>
    ```
    Esto generará una lista con tres elementos `<li>`. La cláusula `track fruta` le dice a Angular cómo hacer un seguimiento de cada elemento. Si el array `frutas` estuviera vacío, se renderizaría el contenido del bloque `@empty`, una característica muy útil que antes requería lógica adicional.


---

## **5. Ejemplo Práctico 1: Lista de Tareas Interactiva (Versión Angular 20)**

Combinaremos los conceptos de componentes independientes y el nuevo control de flujo `@for` y `@if`.
<br>
**Objetivo:** Crear un componente `standalone` que muestre una lista y reaccione a un clic del usuario.
En el directorio donde desarrollamos angular ( directorio frontend), en vs code, usando la terminal escribimos:

```console
ng g c lista-tareas
```


*   **`lista-tareas.ts`**

    La lógica interna no cambia, pero el decorador sí. Ahora el componente es `standalone` e importa `CommonModule` para poder usar directivas como `NgClass` o `NgStyle` si son necesarias (es una buena práctica importarlo si la plantilla tiene algo más que interpolación básica).

    ```typescript
    import { Component } from '@angular/core';
    import { CommonModule } from '@angular/common'; // Importado para futuras directivas

    interface Tarea {
      nombre: string;
      completada: boolean;
    }

    @Component({
      selector: 'app-lista-tareas',
      standalone: true, // ¡Componente independiente!
      imports: [CommonModule],
      templateUrl: './lista-tareas.html',
      styleUrls: ['./lista-tareas.css']
    })
    export class ListaTareasComponent {
      tareas: Tarea[] = [
        { nombre: 'Aprender Componentes Standalone', completada: true },
        { nombre: 'Usar el bloque @for', completada: false },
        { nombre: 'Entender el bloque @if', completada: false }
      ];

      toggleCompletada(tarea: Tarea) {
        tarea.completada = !tarea.completada;
      }
    }
    ```

*   **`lista-tareas.html`**

    Aquí es donde vemos el cambio más significativo. Reemplazamos `*ngIf` y `*ngFor` por la nueva sintaxis de bloques de control de flujo.

    ```html
    <h2>Mi Lista de Tareas</h2>

    @if (tareas.length === 0) {
      <p>¡No hay tareas pendientes!</p>
    }

    <ul>
      @for (tarea of tareas; track tarea.nombre) {
        <li (click)="toggleCompletada(tarea)">
          {{ tarea.nombre }}
          @if (tarea.completada) {
            <span> - ¡Hecho! ✅</span>
          }
        </li>
      }
    </ul>
    ```

*   **`lista-tareas.css`** (Sin cambios)

    ```css
    li {
      cursor: pointer;
      padding: 5px;
    }
    li:hover {
      background-color: #f0f0f0;
    }
    ```

Una vez tenemos el componente listo, ¿cómo podemos usarlo?.
Nos vamos a `app.ts` y cambiamos la siguiente línea de código 

```ts
 imports: [RouterOutlet,],
```

a lo siguiente

```ts
 imports: [RouterOutlet,ListaTareasComponent],
```

Debe añadirse en la cabecera del fichero app.ts el siguiente **import**:

```ts
import { ListaTareasComponent } from './lista-tareas/lista-tareas';
```

Y en el fichero `app.html` añadimos al final

```html
  <div><app-lista-tareas></app-lista-tareas></div>
```

y lanzamos el servidor embebido 

```console
ng server --host 0.0.0.0
```

Se añade **--host 0.0.0.0** para que pueda ser accedido desde fuera del docker.
Abrimos el navegador en http://localhost:4200 y ya debemos ver la web.



---

## **6. Ejemplo Práctico 2: Galería de Imágenes Interactiva (Creada para Angular 20)**

**Objetivo**: Crear un componente que muestre una imagen principal y una lista de miniaturas. Al hacer clic en una miniatura, la imagen principal cambiará para mostrar la imagen seleccionada.

**Conceptos reforzados en Angular 20:**
- Creación de un componente `standalone`.
- Bloque `@for` para iterar sobre el array de imágenes (con `track`).
- Property Binding `[src]` y `[alt]`.
- Event Binding `(click)`.
- Bloque `@if` para mostrar la imagen principal solo si hay una seleccionada.
- Interpolación `{{ }}` para el título.

Usad la web https://picsum.photos para obtener imágenes. Las llamadas son del tipo: https://picsum.photos/id/237/200/200
No hay que utilizar API ninguna.

---
 
[atrás](../README.md)
