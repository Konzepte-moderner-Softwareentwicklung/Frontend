// src/pages/__test__/AGB.test.tsx
import { render, screen, within } from '@testing-library/react';
import AGB from '../AGB'; // <— anpassen falls Pfad anders

describe('AGB page', () => {
  test('rendert Hauptüberschrift und Einleitung', () => {
    render(<AGB />);

    const h1 = screen.getByRole('heading', {
      level: 1,
      name: /Allgemeine Geschäftsbedingungen \(AGB\)/i,
    });
    expect(h1).toBeInTheDocument();

    expect(screen.getByText(/Stand:\s*Juni 2025/i)).toBeInTheDocument();
  });

  test('enthält alle Abschnittsüberschriften 1–9', () => {
    render(<AGB />);

    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s).toHaveLength(9);

    expect(
      screen.getByRole('heading', { level: 2, name: /^1\.\s*Geltungsbereich$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /^2\.\s*Vertragspartner$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /^3\.\s*Vertragsgegenstand$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /^4\.\s*Registrierung und Nutzerkonto$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /^5\.\s*Pflichten der Nutzer$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /^6\.\s*Haftung$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /^7\.\s*Vertragslaufzeit und Kündigung$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /^8\.\s*Änderungen der AGB$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /^9\.\s*Anwendbares Recht$/i })
    ).toBeInTheDocument();
  });

  test('Layout-Container vorhanden (Smoke-Test, keine harten CSS-Assertions)', () => {
    render(<AGB />);
    const outer = screen.getByRole('heading', {
      level: 1,
      name: /Allgemeine Geschäftsbedingungen/i,
    }).closest('div');
    expect(outer).toBeTruthy();
  });

  test('semantische Struktur: jede H2 hat mindestens einen Paragraphen im Section-Container', () => {
    render(<AGB />);
    const h2s = screen.getAllByRole('heading', { level: 2 });

    for (const h2 of h2s) {
      const section = h2.closest('section') as HTMLElement | null;
      expect(section).toBeTruthy();

      if (section) {
        const paragraphs = Array.from(section.querySelectorAll('p'));
        expect(paragraphs.length).toBeGreaterThanOrEqual(1);
        // Optional: Prüfe, dass der erste Paragraph nicht leer ist
        expect(paragraphs[0].textContent?.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('Snapshot der Seite (stabil bei statischem Inhalt)', () => {
    const { container } = render(<AGB />);
    expect(container).toMatchSnapshot();
  });
});
