import { supabase } from '../config/supabase';

export const enrollmentService = {
  /**
   * Fetch all enrollment records
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from("enrolled")
        .select("*")
        .order("Year");
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching all enrollments:", error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Fetch enrollment records by year
   */
  async getByYear(year) {
    try {
      const { data, error } = await supabase
        .from("enrolled")
        .select("*")
        .eq("Year", year)
        .order("College");
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching enrollments by year:", error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Fetch enrollment records by college
   */
  async getByCollege(college) {
    try {
      const { data, error } = await supabase
        .from("enrolled")
        .select("*")
        .eq("College", college)
        .order("Year");
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching enrollments by college:", error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Fetch enrollment records by program
   */
  async getByProgram(program) {
    try {
      const { data, error } = await supabase
        .from("enrolled")
        .select("*")
        .eq("Program", program)
        .order("Year");
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching enrollments by program:", error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Fetch enrollment records with multiple filters
   */
  async getFiltered({ year, college, program, semester }) {
    try {
      let query = supabase.from("enrolled").select("*");

      if (year && year !== "all") {
        query = query.eq("Year", year);
      }
      if (college && college !== "All") {
        query = query.eq("College", college);
      }
      if (program) {
        query = query.eq("Program", program);
      }
      if (semester) {
        query = query.eq("Sem", semester);
      }

      query = query.order("Year");

      const { data, error } = await query;
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching filtered enrollments:", error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get unique filter options (years, colleges, programs)
   */
  async getFilterOptions() {
    try {
      const { data, error } = await supabase
        .from("enrolled")
        .select("Year, College, Program");
      
      if (error) throw error;

      const years = ["all", ...new Set(data.map(d => d.Year))].sort();
      const colleges = ["All", ...new Set(data.map(d => d.College))].sort();
      const programs = [...new Set(data.map(d => d.Program))].sort();

      return { 
        data: { years, colleges, programs }, 
        error: null 
      };
    } catch (error) {
      console.error("Error fetching filter options:", error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Search enrollment records
   */
  async search(searchTerm) {
    try {
      const { data, error } = await supabase
        .from("enrolled")
        .select("*")
        .or(`Program.ilike.%${searchTerm}%,College.ilike.%${searchTerm}%`)
        .order("Year");
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error searching enrollments:", error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Subscribe to real-time changes
   */
  subscribe(callback) {
    const channel = supabase
      .channel("realtime-enrollments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enrolled" },
        (payload) => {
          console.log("Real-time change detected:", payload);
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  },

  /**
   * Unsubscribe from real-time changes
   */
  unsubscribe(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  },

  /**
   * Export data to CSV
   */
  async exportToCSV(filters = {}) {
    try {
      const { data, error } = await this.getFiltered(filters);
      
      if (error) throw new Error(error);
      if (!data || data.length === 0) {
        throw new Error("No data to export");
      }

      // Convert to CSV
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => 
        Object.values(row).map(val => 
          typeof val === 'string' ? `"${val}"` : val
        ).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      // Create download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enrollment-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { success: true, error: null };
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      return { success: false, error: error.message };
    }
  }
};

export default enrollmentService;