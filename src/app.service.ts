import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const HTMLDivElement = `
    <section style="min-height:100dvh;align-content:center;">
      <div style="margin:auto;width:fit-content;display:grid;place-items:center;gap:1rem;">
        <h1>Welcome to the Sakila API!</h1>
        <p>This is a simple API built with NestJS.</p>
        <a href="/swagger">Go to swagger</a>
      </div>
    </section>
    `;
    return HTMLDivElement;
  }
}
