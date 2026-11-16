'use client';

import { useActionState, useEffect, useState } from 'react';
import {
  CalendarPlus, Check, ChevronDown, Copy, Download, FileText, Link2, Loader2, MapPin,
  Search, Upload, Users, X,
} from 'lucide-react';
import {
  createBookingsAction, updateBookingStatusAction, uploadReportAction,
} from '@/app/portal/b2b/actions';
import { StatusPill } from './StatusPill';
import {
  BOOKING_STATUSES, COLLECTION_MODES, isOpenStatus, idleAction,
  type BookingStatus, type CatalogueItem, type CollectionMode, type Employee, type PartnerBooking,
  type PortalActionState,
} from '@/data/portal';
import { cn, formatDate, formatDateTime, formatINR } from '@/lib/utils';

const fieldLabel = 'mb-1 block text-2xs font-semibold uppercase tracking-[0.1em] text-muted';

export function BookingWorkspace({
  partnerId,
  employees,
  catalogue,
  bookings,
  defaultEmployee,
  defaultDate,
  minDate,
}: {
  partnerId: string;
  employees: Employee[];
  catalogue: CatalogueItem[];
  bookings: PartnerBooking[];
  defaultEmployee?: string;
  defaultDate: string;
  minDate: string;
}) {
  const [showForm, setShowForm] = useState(bookings.length === 0 || Boolean(defaultEmployee));
  const [state, formAction, pending] = useActionState(createBookingsAction, idleAction);

  const [employeeQuery, setEmployeeQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(
    defaultEmployee ? [defaultEmployee] : [],
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [mode, setMode] = useState<CollectionMode>('Home Collection');
  const [date, setDate] = useState(defaultDate);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [statusFilter, setStatusFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [bookingQuery, setBookingQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const { status: actionStatus } = state;
  useEffect(() => {
    if (actionStatus === 'ok') {
      setSelectedEmployees([]);
      setSelectedItems([]);
      setLocation('');
      setNotes('');
    }
  }, [state, actionStatus]);

  const query = employeeQuery.trim().toLowerCase();
  const visibleEmployees = employees.filter(
    (employee) =>
      !query ||
      `${employee.name} ${employee.code} ${employee.department} ${employee.location}`.toLowerCase().includes(query),
  );

  const availableItems = catalogue.filter((item) => item.active && item.modes.includes(mode));
  const selectedCatalogue = catalogue.filter((item) => selectedItems.includes(item.id));
  const perEmployee = selectedCatalogue.reduce((sum, item) => sum + item.rate, 0);
  const total = perEmployee * selectedEmployees.length;
  const allVisibleSelected =
    visibleEmployees.length > 0 && visibleEmployees.every((employee) => selectedEmployees.includes(employee.id));

  function toggleEmployee(id: string) {
    setSelectedEmployees((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  }

  function toggleAllVisible() {
    if (allVisibleSelected) {
      const visibleIds = new Set(visibleEmployees.map((employee) => employee.id));
      setSelectedEmployees((current) => current.filter((id) => !visibleIds.has(id)));
    } else {
      setSelectedEmployees((current) => Array.from(new Set([...current, ...visibleEmployees.map((employee) => employee.id)])));
    }
  }

  function changeMode(next: CollectionMode) {
    setMode(next);
    setSelectedItems((current) =>
      current.filter((id) => catalogue.find((item) => item.id === id)?.modes.includes(next)),
    );
  }

  const locations = Array.from(new Set(employees.map((employee) => employee.location).filter(Boolean))).slice(0, 15);

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    const matchesMode = modeFilter === 'All' || booking.mode === modeFilter;
    const haystack = `${booking.employeeName} ${booking.employeeCode} ${booking.id} ${booking.department}`.toLowerCase();
    const matchesQuery = !bookingQuery.trim() || haystack.includes(bookingQuery.trim().toLowerCase());
    return matchesStatus && matchesMode && matchesQuery;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">B2B bookings</p>
          <h1 className="display mt-1.5 text-[2rem] leading-tight sm:text-[2.4rem]">Batches &amp; individual bookings</h1>
          <p className="mt-1 text-xs text-muted">
            One employee or the whole roster — same date, location and catalogue rates.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          aria-expanded={showForm}
          className={showForm ? 'btn-outline btn-sm' : 'btn-primary btn-sm'}
        >
          {showForm ? <><X className="h-3.5 w-3.5" /> Close form</> : <><CalendarPlus className="h-3.5 w-3.5" /> New booking</>}
        </button>
      </div>

      {showForm ? (
        <section className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-ink">Schedule a booking</h2>
            <p className="text-2xs text-muted">Rates are resolved from the partner catalogue, never the client</p>
          </div>

          {catalogue.filter((item) => item.active).length === 0 ? (
            <p className="mt-4 rounded-xl border border-gold/30 bg-gold-soft/60 px-4 py-3 text-xs leading-relaxed text-ink/75">
              This partner has no active catalogue items yet. KOYO operations can add pathology, radiology
              or a custom package on the Catalogue page first.
            </p>
          ) : (
            <form action={formAction} className="mt-5 space-y-5">
              <input type="hidden" name="partnerId" value={partnerId} />

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className={fieldLabel}>Test date</span>
                  <input
                    type="date"
                    name="date"
                    value={date}
                    min={minDate}
                    onChange={(event) => setDate(event.target.value)}
                    className="field"
                  />
                  {state.fields?.date ? <span className="mt-1 block text-2xs text-clay">{state.fields.date}</span> : null}
                </label>

                <fieldset className="sm:col-span-2">
                  <legend className={fieldLabel}>Collection mode</legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {COLLECTION_MODES.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => changeMode(option)}
                        aria-pressed={mode === option}
                        className={cn(
                          'rounded-xl border px-2.5 py-2 text-left text-2xs font-medium transition-colors',
                          mode === option
                            ? 'border-teal/40 bg-teal-mist text-teal-deep'
                            : 'border-line bg-white text-ink/60 hover:border-ink/20',
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="mode" value={mode} />
                  {state.fields?.mode ? <span className="mt-1 block text-2xs text-clay">{state.fields.mode}</span> : null}
                </fieldset>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-line">
                  <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2.5">
                    <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink/55">
                      Employees <span className="text-teal-deep">{selectedEmployees.length}</span>
                    </p>
                    <button
                      type="button"
                      onClick={toggleAllVisible}
                      className="text-[0.625rem] font-semibold text-teal-deep hover:underline"
                    >
                      {allVisibleSelected ? 'Clear shown' : 'Select shown'}
                    </button>
                  </div>
                  <div className="relative border-b border-line px-3 py-2">
                    <Search className="pointer-events-none absolute left-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/30" />
                    <input
                      value={employeeQuery}
                      onChange={(event) => setEmployeeQuery(event.target.value)}
                      placeholder="Search roster"
                      className="w-full rounded-lg border border-line bg-white py-1.5 pl-7 pr-2 text-xs focus:border-teal focus:outline-none"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto p-1.5">
                    {visibleEmployees.length === 0 ? (
                      <p className="px-2 py-4 text-center text-2xs text-muted">
                        {employees.length === 0 ? 'Upload a roster first.' : 'No employee matches that search.'}
                      </p>
                    ) : (
                      visibleEmployees.map((employee) => (
                        <label
                          key={employee.id}
                          className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-teal-mist/60"
                        >
                          <input
                            type="checkbox"
                            name="employeeIds"
                            value={employee.id}
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() => toggleEmployee(employee.id)}
                            className="h-3.5 w-3.5 shrink-0 accent-[#0F7A6C]"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-medium text-ink">{employee.name}</span>
                            <span className="block truncate text-[0.625rem] text-muted">
                              {employee.code} · {employee.department || 'No department'}
                            </span>
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-line">
                  <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2.5">
                    <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink/55">
                      Catalogue <span className="text-teal-deep">{selectedItems.length}</span>
                    </p>
                    <span className="text-[0.625rem] text-muted">{availableItems.length} available</span>
                  </div>
                  <div className="max-h-[17.5rem] overflow-y-auto p-1.5">
                    {availableItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 hover:bg-teal-mist/60"
                      >
                        <input
                          type="checkbox"
                          name="itemIds"
                          value={item.id}
                          checked={selectedItems.includes(item.id)}
                          onChange={() =>
                            setSelectedItems((current) =>
                              current.includes(item.id)
                                ? current.filter((entry) => entry !== item.id)
                                : [...current, item.id],
                            )
                          }
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#0F7A6C]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-medium text-ink">{item.name}</span>
                          <span className="block text-[0.625rem] text-muted">
                            {item.kind} · {item.tatHours} h TAT
                          </span>
                        </span>
                        <span className="tabular shrink-0 text-2xs font-semibold text-ink/75">{formatINR(item.rate)}</span>
                      </label>
                    ))}
                  </div>
                  {selectedItems.length === 0 ? (
                    <p className="border-t border-line px-3 py-2 text-[0.625rem] text-muted">
                      Select at least one test or package.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className={fieldLabel}>
                    {mode === 'Centre Visit' ? 'Collection centre' : mode === 'On-site' ? 'Site / campus' : 'Home address'}
                  </span>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                    <input
                      name="location"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      list="koyo-portal-locations"
                      className="field pl-10"
                      placeholder={
                        mode === 'Centre Visit'
                          ? 'KOYO Centre — Koramangala, Bengaluru'
                          : mode === 'On-site'
                            ? 'Meridian Tech — Whitefield campus, Bengaluru'
                            : 'Employee home address with pincode'
                      }
                    />
                    <datalist id="koyo-portal-locations">
                      {locations.map((entry) => <option key={entry} value={entry} />)}
                    </datalist>
                  </div>
                  {state.fields?.location ? <span className="mt-1 block text-2xs text-clay">{state.fields.location}</span> : null}
                </label>
                <label className="block sm:col-span-2">
                  <span className={fieldLabel}>Notes for the collection team (optional)</span>
                  <textarea
                    name="notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={2}
                    className="field resize-none"
                    placeholder="Camp desk 2, ground floor. 24 employees in this batch."
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-sand/50 px-4 py-3">
                <div className="text-2xs text-muted">
                  <span className="font-semibold text-ink">{selectedEmployees.length}</span> employee
                  {selectedEmployees.length === 1 ? '' : 's'} ×{' '}
                  <span className="font-semibold text-ink">{selectedItems.length}</span> item
                  {selectedItems.length === 1 ? '' : 's'}
                  <span className="ml-2 text-ink/40">· {mode} · {date ? formatDate(date) : 'choose a date'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <p className="tabular text-sm font-semibold text-ink">{formatINR(total)}</p>
                  <button
                    type="submit"
                    disabled={pending || selectedEmployees.length === 0 || selectedItems.length === 0}
                    className="btn-primary btn-sm"
                  >
                    {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Users className="h-3.5 w-3.5" />}
                    {pending
                      ? 'Scheduling…'
                      : `Schedule ${selectedEmployees.length || ''} booking${selectedEmployees.length === 1 ? '' : 's'}`}
                  </button>
                </div>
              </div>

              {state.status === 'ok' ? (
                <p className="rounded-lg border border-teal/25 bg-teal-mist px-3 py-2 text-xs font-medium text-teal-deep">
                  {state.message}
                </p>
              ) : null}
              {state.status === 'error' ? (
                <p role="alert" className="rounded-lg border border-clay/20 bg-clay/10 px-3 py-2 text-xs text-clay">
                  {state.message}
                </p>
              ) : null}
            </form>
          )}
        </section>
      ) : null}

      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-ink">Booking register</h2>
            <p className="mt-0.5 text-2xs text-muted">
              {filteredBookings.length} of {bookings.length} bookings · newest test date first
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">Search bookings</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/30" />
              <input
                value={bookingQuery}
                onChange={(event) => setBookingQuery(event.target.value)}
                placeholder="Employee, code, booking"
                className="h-9 w-44 rounded-full border border-line bg-white pl-8 pr-3 text-xs focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15"
              />
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
              className="h-9 rounded-full border border-line bg-white px-3 text-xs text-ink/70 focus:border-teal focus:outline-none"
            >
              <option value="All">All statuses</option>
              {BOOKING_STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
            <select
              value={modeFilter}
              onChange={(event) => setModeFilter(event.target.value)}
              aria-label="Filter by collection mode"
              className="h-9 rounded-full border border-line bg-white px-3 text-xs text-ink/70 focus:border-teal focus:outline-none"
            >
              <option value="All">All modes</option>
              {COLLECTION_MODES.map((entry) => <option key={entry}>{entry}</option>)}
            </select>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-ink">No bookings yet</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted">
              Pick employees and catalogue items above to raise the first booking.
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <p className="px-5 py-8 text-center text-xs text-muted">No booking matches those filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-koyo min-w-[900px]">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Employee</th>
                  <th>Tests</th>
                  <th>Test date</th>
                  <th>Collection</th>
                  <th>Status</th>
                  <th>Report</th>
                  <th aria-label="Manage" />
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <FragmentRow
                    key={booking.id}
                    booking={booking}
                    expanded={expanded === booking.id}
                    onToggle={() => setExpanded(expanded === booking.id ? null : booking.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function FragmentRow({
  booking, expanded, onToggle,
}: {
  booking: PartnerBooking;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className={expanded ? 'bg-teal-mist/40' : undefined}>
        <td>
          <p className="font-mono text-[0.6875rem] font-medium text-ink">{booking.id}</p>
          <p className="text-2xs text-muted">{isOpenStatus(booking.status) ? 'open' : booking.status === 'Cancelled' ? 'cancelled' : 'closed'}</p>
        </td>
        <td>
          <p className="text-[0.8125rem] font-medium text-ink">{booking.employeeName}</p>
          <p className="text-2xs text-muted">{booking.employeeCode} · {booking.department || '—'}</p>
        </td>
        <td>
          <p className="max-w-[14rem] truncate text-[0.8125rem] text-ink/75">{booking.items[0]?.name ?? '—'}</p>
          <p className="text-2xs text-muted">{booking.items.length} item{booking.items.length === 1 ? '' : 's'} · {formatINR(booking.total)}</p>
        </td>
        <td className="whitespace-nowrap text-[0.8125rem]">{formatDate(booking.date, { year: undefined })}</td>
        <td>
          <p className="text-[0.75rem] text-ink/70">{booking.mode}</p>
          <p className="max-w-[12rem] truncate text-2xs text-muted">{booking.location}</p>
        </td>
        <td><StatusPill status={booking.status} /></td>
        <td>
          {booking.report ? (
            <span className="inline-flex items-center gap-1 text-2xs font-semibold text-teal-deep">
              <FileText className="h-3 w-3" /> Released
            </span>
          ) : (
            <span className="text-2xs text-ink/40">Pending</span>
          )}
        </td>
        <td className="text-right">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1 text-2xs font-semibold text-ink/70 transition-colors hover:border-teal/40 hover:text-teal-deep"
          >
            {expanded ? 'Close' : 'Manage'}
            <ChevronDown className={cn('h-3 w-3 transition-transform', expanded && 'rotate-180')} />
          </button>
        </td>
      </tr>
      {expanded ? (
        <tr>
          <td colSpan={8} className="bg-sand/30 px-4 py-4">
            <BookingDetail booking={booking} />
          </td>
        </tr>
      ) : null}
    </>
  );
}

function BookingDetail({ booking }: { booking: PartnerBooking }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        <div>
          <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink/45">Tests in this booking</p>
          <ul className="mt-2 divide-y divide-line rounded-xl border border-line bg-white">
            {booking.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-ink">{item.name}</span>
                  <span className="block text-[0.625rem] text-muted">{item.kind}</span>
                </span>
                <span className="tabular shrink-0 text-xs text-ink/70">{formatINR(item.rate)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-line bg-white px-3 py-2.5 text-2xs leading-relaxed text-muted">
          <p className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-teal" /> {booking.location}
          </p>
          {booking.notes ? <p className="mt-1.5 border-t border-line pt-1.5">{booking.notes}</p> : null}
        </div>

        <div>
          <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink/45">History</p>
          <ol className="mt-2 space-y-2">
            {booking.history.map((entry, index) => (
              <li key={`${entry.at}-${entry.status}`} className="flex gap-2.5">
                <span className="mt-1 flex flex-col items-center">
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      index === booking.history.length - 1 ? 'bg-teal' : 'bg-ink/20',
                    )}
                  />
                  {index < booking.history.length - 1 ? <span className="mt-0.5 h-full w-px bg-line" /> : null}
                </span>
                <span>
                  <span className="block text-2xs font-semibold text-ink">{entry.status}</span>
                  <span className="block text-[0.625rem] text-muted">
                    {entry.actor} · {entry.role} · {formatDateTime(entry.at)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <PatientLink token={booking.patientToken} />
      </div>

      <div className="space-y-3">
        <StatusForm key={`${booking.id}-${booking.status}`} booking={booking} />
        <ReportForm key={`${booking.id}-${booking.report?.uploadedAt ?? 'none'}`} booking={booking} />
      </div>
    </div>
  );
}

function StatusForm({ booking }: { booking: PartnerBooking }) {
  const [state, action, pending] = useActionState(updateBookingStatusAction, idleAction);
  return (
    <div className="rounded-xl border border-line bg-white p-3.5">
      <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink/45">Update status</p>
      <p className="mt-0.5 text-[0.625rem] text-muted">
        Either team can move this booking forward; the change is logged against {booking.statusBy}.
      </p>
      <form action={action} className="mt-2.5 flex flex-wrap items-center gap-2">
        <input type="hidden" name="bookingId" value={booking.id} />
        <select name="status" defaultValue={booking.status} className="field h-9 flex-1 py-0 text-xs">
          {BOOKING_STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
        <button type="submit" disabled={pending} className="btn-teal btn-sm">
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          Update
        </button>
      </form>
      {state.status === 'ok' ? <p className="mt-2 text-[0.6875rem] font-medium text-teal-deep">{state.message}</p> : null}
      {state.status === 'error' ? <p className="mt-2 text-[0.6875rem] text-clay">{state.message}</p> : null}
    </div>
  );
}

function ReportForm({ booking }: { booking: PartnerBooking }) {
  const [state, action, pending] = useActionState(uploadReportAction, idleAction);

  return (
    <div className="rounded-xl border border-line bg-white p-3.5">
      <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink/45">Report</p>

      {booking.report ? (
        <div className="mt-2 rounded-lg border border-teal/20 bg-teal-mist/60 px-2.5 py-2 text-2xs leading-relaxed text-teal-deep">
          <p className="font-semibold">
            Released {formatDateTime(booking.report.uploadedAt)} by {booking.report.uploadedBy}
          </p>
          {booking.report.note ? <p className="mt-1 text-ink/70">{booking.report.note}</p> : null}
          {booking.report.file ? (
            <a
              href={`/api/portal/reports/${booking.id}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 font-semibold text-teal-deep hover:underline"
            >
              <Download className="h-3 w-3" /> {booking.report.file.name}
            </a>
          ) : null}
        </div>
      ) : (
        <p className="mt-0.5 text-[0.625rem] text-muted">
          Attach a signed PDF or image, or write a summary. Releasing marks the booking Report ready.
        </p>
      )}

      <form action={action} className="mt-2.5 space-y-2">
        <input type="hidden" name="bookingId" value={booking.id} />
        <input
          type="file"
          name="file"
          accept="application/pdf,image/jpeg,image/png"
          className="block w-full text-[0.6875rem] text-ink/55 file:mr-2.5 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-[0.625rem] file:font-semibold file:text-white"
        />
        <textarea
          name="note"
          rows={2}
          className="field resize-none text-xs"
          placeholder="Summary the employee will see — e.g. all values within range, retest in 12 months."
        />
        <button type="submit" disabled={pending} className="btn-outline btn-sm w-full">
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {pending ? 'Uploading…' : booking.report ? 'Replace report' : 'Release report'}
        </button>
      </form>

      {state.status === 'ok' ? <p className="mt-2 text-[0.6875rem] font-medium text-teal-deep">{state.message}</p> : null}
      {state.status === 'error' ? <p className="mt-2 text-[0.6875rem] text-clay">{state.message}</p> : null}
    </div>
  );
}

function PatientLink({ token }: { token: string }) {
  const [url, setUrl] = useState(`/portal/patient/${token}`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/portal/patient/${token}`);
  }, [token]);

  return (
    <div className="rounded-xl border border-dashed border-line px-3 py-2.5">
      <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink/45">Employee report link</p>
      <div className="mt-1.5 flex items-center gap-2">
        <Link2 className="h-3.5 w-3.5 shrink-0 text-teal" />
        <p className="min-w-0 flex-1 truncate font-mono text-[0.625rem] text-ink/55">{url}</p>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard
              .writeText(url)
              .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              })
              .catch(() => undefined);
          }}
          className="inline-flex shrink-0 items-center gap-1 text-[0.625rem] font-semibold text-teal-deep hover:underline"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-1.5 text-[0.625rem] leading-relaxed text-muted">
        Share only with the employee. The link shows their status and report, never the rate card.
      </p>
    </div>
  );
}
