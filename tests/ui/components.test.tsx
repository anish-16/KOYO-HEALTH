import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from '@/components/ui/Accordion';
import { Sparkline } from '@/components/dashboard/Sparkline';
import { Badge, Stars, Breadcrumbs } from '@/components/ui/Primitives';
import { AddToBooking } from '@/components/services/AddToBooking';
import { BookingProvider } from '@/components/booking/BookingProvider';
import { TestDetailProvider, TestTrigger } from '@/components/tests/TestDetailProvider';

const items = [
  { q: 'Do I need to fast?', a: 'Only for lipid and glucose tests.' },
  { q: 'Can I reschedule?', a: 'Yes, free up to four hours before.' },
  { q: 'Where is my report?', a: 'In your dashboard, usually within 12 hours.' },
];

describe('Accordion', () => {
  it('renders every question and opens the first panel by default', () => {
    render(<Accordion items={items} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByText('Do I need to fast?')).toBeInTheDocument();
    expect(screen.getByText('Only for lipid and glucose tests.')).toBeVisible();
    expect(screen.getByRole('button', { name: /Do I need to fast/ })).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles a panel closed and opens another', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.click(screen.getByRole('button', { name: /Can I reschedule/ }));
    expect(screen.getByRole('button', { name: /Can I reschedule/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /Do I need to fast/ })).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports starting with every panel closed', () => {
    render(<Accordion items={items} defaultOpen={null} />);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    }
  });
});

describe('Sparkline', () => {
  it('renders an accessible trend chart with a path', () => {
    const { container } = render(<Sparkline values={[5, 4, 3, 2, 4, 6]} />);
    expect(screen.getByRole('img', { name: /trend/i })).toBeInTheDocument();
    expect(container.querySelectorAll('path').length).toBeGreaterThanOrEqual(2);
  });

  it('handles flat series without dividing by zero', () => {
    const { container } = render(<Sparkline values={[3, 3, 3, 3]} tone="gold" />);
    expect(container.querySelector('path')?.getAttribute('d')).not.toContain('NaN');
  });
});

describe('AddToBooking', () => {
  const item = {
    id: 'mri/mri-brain-plain', serviceSlug: 'mri', serviceName: 'MRI Scan', testName: 'MRI Brain (Plain)',
    price: 2999, mrp: 4500, fastingHours: 0, homeCollection: false, sample: 'None',
  };

  it('adds, then removes, the same item on a second click', async () => {
    const user = userEvent.setup();
    render(<BookingProvider><AddToBooking item={item} /></BookingProvider>);

    const addButton = screen.getByRole('button', { name: /Add MRI Brain \(Plain\) to booking/ });
    expect(addButton).toHaveAttribute('aria-pressed', 'false');
    await user.click(addButton);

    const removeButton = screen.getByRole('button', { name: /Remove MRI Brain \(Plain\) from booking/ });
    expect(removeButton).toHaveAttribute('aria-pressed', 'true');
    await user.click(removeButton);

    expect(screen.getByRole('button', { name: /Add MRI Brain \(Plain\) to booking/ })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('TestDetailProvider', () => {
  const trigger = (
    <BookingProvider>
      <TestDetailProvider>
        <TestTrigger id="pathology/complete-blood-count-cbc">Complete Blood Count (CBC)</TestTrigger>
      </TestDetailProvider>
    </BookingProvider>
  );

  it('opens a floating panel with the test, its facts and a booking action', async () => {
    const user = userEvent.setup();
    render(trigger);

    expect(screen.queryByRole('dialog', { name: /full test details/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Complete Blood Count (CBC)' }));

    const panel = screen.getByRole('dialog', { name: /Complete Blood Count \(CBC\) — full test details/ });
    expect(panel).toBeInTheDocument();
    expect(screen.getByText('Everyday & organ function · Pathology')).toBeInTheDocument();
    expect(screen.getByText('268 accredited')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Complete Blood Count \(CBC\) to booking/ })).toBeInTheDocument();
  });

  it('adds the test to the booking from inside the panel', async () => {
    const user = userEvent.setup();
    render(trigger);

    await user.click(screen.getByRole('button', { name: 'Complete Blood Count (CBC)' }));
    await user.click(screen.getByRole('button', { name: /Add Complete Blood Count \(CBC\) to booking/ }));

    expect(screen.getByRole('dialog', { name: 'Your booking' })).toBeInTheDocument();
    expect(screen.getByText('1 test added')).toBeInTheDocument();
  });

  it('closes on Escape so the page underneath is reachable again', async () => {
    const user = userEvent.setup();
    render(trigger);

    await user.click(screen.getByRole('button', { name: 'Complete Blood Count (CBC)' }));
    await user.keyboard('{Escape}');

    // The panel animates out, so it leaves the DOM a frame after Escape.
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: /full test details/ })).not.toBeInTheDocument(),
    );
  });
});

describe('primitives', () => {
  it('renders badges with their accessible text', () => {
    render(<Badge tone="teal">NABL</Badge>);
    expect(screen.getByText('NABL')).toBeInTheDocument();
  });

  it('labels star ratings for screen readers', () => {
    render(<Stars rating={4} />);
    expect(screen.getByLabelText('4 out of 5 stars')).toBeInTheDocument();
  });

  it('marks the current breadcrumb with aria-current', () => {
    render(<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Book a test' }]} />);
    expect(screen.getByText('Book a test')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });
});
